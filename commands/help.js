const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('幫助')
    .setDescription('📖 顯示所有可用指令的說明'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor(0x2ECC71)
      .setTitle('🌿 Minecraft 史萊姆百科 · 指令列表')
      .setDescription('以下是所有可用的 Slash Commands：')
      .addFields(
        {
          name: '📖 `/幫助`',
          value: '顯示此幫助清單，列出所有指令。',
        },
        {
          name: '🔍 `/問百科 <關鍵字>`',
          value: '查詢 Minecraft 物品、生物或機制的百科資訊。',
        },
        {
          name: '🖥️ `/測試伺服器`',
          value: '測試 Bot 與伺服器的連線狀態，並回傳延遲數據。',
        },
      )
      .setFooter({ text: '⚠ 此機器人僅作爲測試實驗用，目前為 ALPHA 版本. · 由 Claude Sonnet 及史萊姆協力製作'})
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
