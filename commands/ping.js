const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('測試伺服器')
    .setDescription('🖥️ 測試 Bot 與 Discord 伺服器的連線狀態與延遲'),

  async execute(interaction, client) {
    // 先送出一個暫時回覆以計算往返延遲
    const sent = await interaction.reply({
      content: '⏱️ 正在測試連線…',
      fetchReply: true,
    });

    const roundTrip = sent.createdTimestamp - interaction.createdTimestamp;
    const wsLatency = Math.round((interaction.client ?? client).ws.ping);

    // 根據延遲決定顏色與評語
    const getStatus = (ms) => {
      if (ms < 80)  return { color: 0x2ECC71, label: '🟢 極佳' };
      if (ms < 150) return { color: 0xF1C40F, label: '🟡 良好' };
      if (ms < 300) return { color: 0xE67E22, label: '🟠 普通' };
      return           { color: 0xE74C3C, label: '🔴 較差' };
    };

    const rtStatus = getStatus(roundTrip);
    const wsStatus = getStatus(wsLatency);

    const embed = new EmbedBuilder()
      .setColor(rtStatus.color)
      .setTitle('🖥️ 伺服器連線狀態')
      .addFields(
        { name: '📡 WebSocket 延遲', value: `${wsStatus.label}  \`${wsLatency} ms\``, inline: true },
        { name: '↩️ 訊息往返延遲', value: `${rtStatus.label}  \`${roundTrip} ms\``, inline: true },
        { name: '🤖 Bot 狀態', value: '`線上運行中`', inline: true },
      )
      .setFooter({ text: 'Minecraft 史萊姆百科 Bot' })
      .setTimestamp();

    await interaction.editReply({ content: '', embeds: [embed] });
  },
};
