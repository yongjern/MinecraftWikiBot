const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

// ── 內建百科資料庫 (可自行擴充) ───────────────────────────────
const wikiData = {
  '史萊姆': {
    emoji: '🟩',
    description: '史萊姆是一種在特定的史萊姆區塊或沼澤生態域生成的果凍狀生物。',
    drops: '史萊姆球',
    habitat: '史萊姆區塊（地底）、沼澤生態域（夜晚）',
    note: '擊殺大型史萊姆可獲得史萊姆球，可用來製作黏性活塞和史萊姆方塊！',
    // 未定義 itempic，將使用預設圖片
  },
  '鑽石': {
    emoji: '💎',
    description: '鑽石是遊戲中最珍貴的礦石之一，通常在 Y=-58 至 Y=16 之間生成。',
    drops: '鑽石',
    habitat: 'Y=-58 附近最為常見',
    note: '開採時使用附魔「幸運 III」的鐵鎬或以上，可大幅增加掉落量。', // 修正：這裡原本漏了逗號
    itempic: 'https://zh.minecraft.wiki/images/Diamond_JE2_BE2.png?36a4d',
  },
  '苦力怕': {
    emoji: '💣',
    description: '苦力怕（Creeper）是 Minecraft 中最具代表性的敵對生物，會悄悄靠近玩家並爆炸。',
    drops: '火藥、音樂唱片（被骷髏射殺時）',
    habitat: '地面（夜晚）、黑暗洞穴',
    note: '貓咪會讓苦力怕逃跑，是防止爆炸的好幫手！',
  },
  '末影龍': {
    emoji: '🐉',
    description: '末影龍是遊戲的最終 Boss，居住在終界（The End）的中央島嶼。',
    drops: '大量經驗值、龍蛋、終界傳送門開啟',
    habitat: '終界（The End）',
    note: '摧毀所有末地水晶後再攻擊龍頭，可造成最大傷害！',
  },
  '釀造台': {
    emoji: '⚗️',
    description: '釀造台用於製作各種藥水，是生存進階不可缺少的工作台。',
    drops: '—', // 這裡標記為無掉落物
    habitat: '玩家製作 / 村莊教堂',
    note: '需要地獄疣、玻璃瓶和水瓶作為基礎材料開始釀造。',
  },
};

// 預設圖片 URL (屏障)
const DEFAULT_IMAGE = 'https://zh.minecraft.wiki/images/thumb/Barrier_JE2_BE2.png/150px-Barrier_JE2_BE2.png?81f6a';

// ── 指令定義 ─────────────────────────────────────────────────
module.exports = {
  data: new SlashCommandBuilder()
    .setName('問百科')
    .setDescription('🔍 查詢 Minecraft 的生物、物品或機制資訊')
    .addStringOption(option =>
      option
        .setName('關鍵字')
        .setDescription('輸入你想查詢的內容，例如：史萊姆、鑽石、苦力怕')
        .setRequired(true)
    ),

  async execute(interaction) {
    const keyword = interaction.options.getString('關鍵字').trim();
    const result = wikiData[keyword];

    // 1. 處理查無資料的情況
    if (!result) {
      const notFoundEmbed = new EmbedBuilder()
        .setColor(0xE74C3C)
        .setTitle('❌ 查無資料')
        .setDescription(`找不到關鍵字「**${keyword}**」的相關資訊。`)
        .addFields({
          name: '💡 目前支援查詢的關鍵字',
          value: Object.keys(wikiData).map(k => `\`${k}\``).join('、'),
        })
        .setFooter({ text: 'Minecraft 史萊姆百科 Bot' })
        .setTimestamp();

      return interaction.reply({ embeds: [notFoundEmbed], ephemeral: true });
    }

    // 2. 準備動態 Fields 陣列
    const fields = [];

    // 判斷：如果欄位不為空且不是 "—"，才加入 Fields
    if (result.drops && result.drops !== '—') {
      fields.push({ name: '📦 掉落物', value: result.drops, inline: true });
    }
    
    if (result.habitat && result.habitat !== '—') {
      fields.push({ name: '🗺️ 出現位置', value: result.habitat, inline: true });
    }
    
    if (result.note && result.note !== '—') {
      fields.push({ name: '💡 小提示', value: result.note, inline: false });
    }

    // 3. 構建 Embed
    const embed = new EmbedBuilder()
      .setColor(0xF39C12)
      .setTitle(`${result.emoji} ${keyword}`)
      .setDescription(result.description)
      // 邏輯：如果 result.itempic 為空，則使用預設圖片
      .setThumbnail(result.itempic || DEFAULT_IMAGE)
      .addFields(fields) // 插入動態生成的 Fields
      .setFooter({ text: 'Minecraft 史萊姆百科 Bot · 資料僅供參考' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
