module.exports = async (client) => {
  const commands = [];
  client.commands.each(command => commands.push(command.data.toJSON()));
  await client.application.commands.set(commands);
  
}
