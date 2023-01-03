const host = require('express')();
host.get('/', (req, res) => res.send('Thank you for the ping!'));
host.listen(2022);

const {
  Client,
  Options,
  Collection,
  ActivityType,
  GatewayIntentBits
} = require('discord.js'),
fs = require('fs');

const client = new Client({
  /* uses all intents, restricting these to few is highly recommended so as to consume less memory */
  intents: Object.values(GatewayIntentBits)
    .filter(perm => typeof perm === 'number'),
  shards: 'auto',
  // remove the entire makeCache property if you don't want it, more documentation on it below:
  // https://discord.js.org/#/docs/discord.js/main/typedef/ClientOptions
  // https://discord.js.org/#/docs/discord.js/main/class/Options?scrollTo=s-cacheWithLimits
  makeCache: Options.cacheWithLimits({
    // Note: you can specify all managers here, but keep in mind that all managers work differently
    // Here, we try to cache minimum number of members from each guild instead of 100s (default)
    MessageManager: 100,
    GuildForumThreadManager: 1,
    GuildMemberManager: {
      maxSize: 1,
      keepOverLimit: member => member.id === client.user.id
    },
    GuildTextThreadManager: 1,
    ThreadManager: 1, // switch to 10 if the manager doesn't work
    ThreadMemberManager: 0 // set to 10 if you want thread members to be cached
  }),
  presence: {
    status: 'idle',
    afk: false,
    activities: [{
      name: 'My Own Damn Self',
      type: ActivityType.Watching,
      url: 'https://twitch.tv/nocopyrightsounds'
    }]
  }
});

/* this is something experimental try out if you want
delete client.sweepers.options;
clearInterval(client.sweepers.intervals.threads);
client.sweepers.intervals.threads = null;
*/

client.config = require('./util/config');
client.commands = new Collection();
client.db = require('croxydb');
client.db.setReadable(true);

fs.readdirSync('./commands').filter(f => f.endsWith('.js')).forEach(c => {
  const command = require(`./commands/${c}`);
  client.commands.set(command.name, command);
});

fs.readdirSync('./events').filter(f => f.endsWith('.js')).forEach(e => {
  let event = e.split('.')[0], task = require(`./events/${e}`);
  client.on(`${event}`, task.bind(null, client));
});

client.config.onboot(client, client.config.auth);
