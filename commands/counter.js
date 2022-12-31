const {
  ChannelType,
  SlashCommandBuilder
} = require('discord.js');

module.exports = {
  name: 'counter', // command name
  // define command
  data: new SlashCommandBuilder()
  .setName('counter')
  .setDescription('configure counter settings')
  .addChannelOption(channel => channel
    .setName('channel')
    .setDescription('select a channel to enable/disable the counter')
    .addChannelTypes(ChannelType.GuildText)
    .setRequired(true))
  .addIntegerOption(count => count
    .setName('count')
 // .setMinValue(0)
    .setDescription(`update the counter's count`)),

  // to do
  // note: for autocomplete/context menu commands you can run code depending upon their type (interaction.type)
  // visit https://discord-api-types.dev/api/discord-api-types-v10/enum/InteractionType for a full list of interaction types
  run: async (client, i) => {
    await i.deferReply({ ephemeral: true });
    const channel = i.options.getChannel('channel'),
      count = i.options.getInteger('count');
    let data = client.db.get(i.guild.id);
    if (!data) {
      data = {};
      data[channel.id] = count || 0;
      client.db.set(i.guild.id, data);
      return await i.editReply({
        content: `✅ You shall start with ${data[channel.id] + 1} in ${channel.name}`
      });
    }
    if (count) {
      if (count < 0) return await i.editReply({
        content: `**Be Positive Please!**`
      });
      data[channel.id] = count;
      client.db.set(i.guild.id, data);
      return await i.editReply({
        content: `✅ You shall start with ${count + 1} in ${channel.name}`
      });
    }
    else if (!count) {
      if (!data[channel.id]) {
        data[channel.id] = 0;
        client.db.set(i.guild.id, data);
        return await i.editReply({
          content: `✅ You shall start with 1 in ${channel.name}`
        });
      } else if (data[channel.id]) {
        delete data[channel.id];
        client.db.set(i.guild.id, data);
        return await i.editReply({
          content: `✅ No one can count in ${channel.name} anymore`
        });
      }
    }
  }
}
