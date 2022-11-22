const { SlashCommandBuilder } = require('@discordjs/builders'),
{ ChannelType } = require('discord.js');


module.exports = new SlashCommandBuilder()
.setName('counter')
.setDescription('configure counter settings')
.addChannelOption(channel => channel
  .setName('channel')
  .setDescription('select a channel to enable/disable the counter')
  .addChannelTypes(ChannelType.GuildText)
  .setRequired(true))
.addIntegerOption(count => count
  .setName('count')
  .setDescription(`update the counter's count`))
