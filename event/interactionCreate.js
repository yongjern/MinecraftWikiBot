module.exports = {
  name: 'interactionCreate',
  once: false,

  async execute(interaction, client) {
    // 只處理 Slash Commands
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) {
      console.warn(`⚠️  找不到指令：${interaction.commandName}`);
      return interaction.reply({
        content: '❌ 找不到此指令，請使用 `/幫助` 查看可用指令。',
        ephemeral: true,
      });
    }

    try {
      await command.execute(interaction, client);
    } catch (error) {
      console.error(`❌ 執行指令「${interaction.commandName}」時發生錯誤：`, error);

      const errorMsg = { content: '⚠️ 執行指令時發生錯誤，請稍後再試。', ephemeral: true };

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(errorMsg);
      } else {
        await interaction.reply(errorMsg);
      }
    }
  },
};
