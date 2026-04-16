const { ActivityType } = require('discord.js');

module.exports = {
  name: 'ready',
  once: true,

  execute(client) {
    console.log(`\n🎮 Bot 已上線！登入身份：${client.user.tag}`);
    console.log(`📋 已載入 ${client.commands.size} 個指令\n`);

    // ── 自定義狀態設定 ────────────────────────────────────────
    // 狀態：Idle（閒置）
    // 活動：正在玩 Minecraft 史萊姆百科 !
    client.user.setPresence({
      status: 'idle',                        // online | idle | dnd | invisible
      activities: [
        {
          name: 'Minecraft 史萊姆百科 !',
          type: ActivityType.Playing,          // Playing / Watching / Listening / Streaming / Competing
        },
      ],
    });

    console.log('✨ 自定義狀態已設定：Idle · 正在玩 Minecraft 史萊姆百科 !');
  },
};
