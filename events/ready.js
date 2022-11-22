const commands = [], fs = require('fs');

fs.readdirSync('./commands').forEach(c => {
  let command = require(`../commands/${c}`).toJSON();
  commands.push(command);
});

module.exports = async (client) => {
  await client.application.commands.set(commands);
}
