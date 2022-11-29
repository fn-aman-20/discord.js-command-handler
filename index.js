/* const host = require('express')();
host.get('/', (req, res) => res.send('Thank you for the ping!'));
host.listen(2022); tranform this comment into code if you are using replit and are going to ping it */

const {
  Client,
  Options,
  ActivityType,
  GatewayIntentBits
} = require('discord.js');

const client = new Client({
  // uses all intents, restrict if you want to
  intents: Object.values(GatewayIntentBits)
    .filter(perm => typeof perm === 'number'),
  shards: 'auto',
  // remove the entire makeCache property if you don't want it, more documentation on it below:
  // https://discord.js.org/#/docs/discord.js/main/typedef/ClientOptions
  // https://discord.js.org/#/docs/discord.js/main/class/Options?scrollTo=s-cacheWithLimits
  makeCache: Options.cacheWithLimits({
    // Note: you can specify all managers here, but keep in mind that all managers work differently
    // Here, we try to cache minimum number of members from each guild instead of 100s (default)
    GuildForumThreadManager: 1,
    GuildMemberManager: {
      maxSize: 10,
      keepOverLimit: member => member.id === client.user.id
    },
    GuildTextThreadManager: 1,
    ThreadManager: 5, // switch to 10 if the manager doesn't work
    ThreadMemberManager: 0 // set to 5 or 10 if you want thread members to be cached
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

// remove line 43 - 46 if you didn't use the makeCache prop in client
delete client.sweepers.options;
clearInterval(client.sweepers.intervals.threads);
client.sweepers.intervals.threads = null;
client.config = require('./util/config');
client.db = require('croxydb');
client.db.setReadable(true);

require('fs').readdirSync('./events').filter(f => f.endsWith('.js')).forEach(e => {
  let event = e.split('.')[0], task = require(`./events/${e}`);
  client.on(`${event}`, task.bind(null, client));
});

client.config.onboot(client, client.config.auth);
