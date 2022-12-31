module.exports = async (client, i) => {
  if (!i.guild || i.user.bot) return;
  (async () => { // one block for all of your chat input commands!
    let command = client.commands.get(i.commandName);
    if (!command) return;
    try { await command.run(client, i) } catch { return };
  })();
  // more code here
}
