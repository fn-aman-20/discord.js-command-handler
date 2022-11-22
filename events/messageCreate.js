module.exports = async (client, message) => {
  // counter
  (async () => {
    const data = client.db.get(message.guild.id);
    if (typeof data[message.channel.id] === 'number') {
      const num = data[message.channel.id],
      next_num = num + 1,
      number = Number(message.content.split(/ +/g)[0]);
      if (typeof number !== 'number') return await message.delete();
      if (number !== next_num) return await message.delete();
      data[message.channel.id] = next_num;
      client.db.set(message.guild.id, data);
      await message.react('<:check_mark:988095400290451467>');
    } else return;
  })();
}
