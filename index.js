const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// ── 建立 Client ──────────────────────────────────────────────
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
  ],
});

// ── 載入指令 ─────────────────────────────────────────────────
client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
    console.log(`✅ 已載入指令：${command.data.name}`);
  } else {
    console.warn(`⚠️  ${file} 缺少 data 或 execute 屬性，已跳過。`);
  }
}

// ── 載入事件 ─────────────────────────────────────────────────
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(f => f.endsWith('.js'));

for (const file of eventFiles) {
  const event = require(path.join(eventsPath, file));
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
  console.log(`📡 已載入事件：${event.name}`);
}

// ── 自動部署 Slash Commands 後登入 ───────────────────────────
(async () => {
  try {
    const commandPayloads = [...client.commands.values()].map(cmd => cmd.data.toJSON());
    const rest = new REST().setToken(process.env.DISCORD_TOKEN);

    console.log('🔄 正在自動部署 Slash Commands…');
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commandPayloads },
    );
    console.log('✅ Slash Commands 部署成功！');
  } catch (err) {
    console.error('❌ 部署指令失敗：', err);
  }

  client.login(process.env.DISCORD_TOKEN);
})();