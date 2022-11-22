const { PermissionsBitField } = require('discord.js');

module.exports = async (client, i) => {
  if (i.user.id !== '858551569263755284' && !i.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await i.reply({
    content: `Sorry, I agree with Admins for my configuration.`
  });
  if (i.isCommand()) {
    if (i.commandName === 'counter') {
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
}
