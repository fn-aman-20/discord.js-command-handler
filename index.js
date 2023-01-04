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
  /* uses all intents for development purposes by default, restricting these to few is highly recommended so as to consume less memory */
  intents: Object.values(GatewayIntentBits)
    .filter(perm => typeof perm === 'number'),
  shards: 'auto',
  // remove the entire makeCache property if you don't want it, more documentation on it below:
  // https://discord.js.org/#/docs/discord.js/main/typedef/ClientOptions
  // https://discord.js.org/#/docs/discord.js/main/class/Options?scrollTo=s-cacheWithLimits
  makeCache: Options.cacheWithLimits({
    MessageManager: 100,
    GuildForumThreadManager: 1,
    /*
    Each manager creates its own collection, collection is just an upgraded version of js map
    The bot uses it to store data and hence avoids calling discord for help all time by accessing the data required from the cache instead, aka it also prevents getting rate limited to an extent
    Here, we reduce the number of members we cache from each guild as we rarely need it
    Same for threads and forums
    Read in more detail from README.md
    */
    GuildMemberManager: {
      maxSize: 1, // size of the collection of this manager 
      keepOverLimit: member => member.user.id === client.user.id // condition, if true, the member is allowed to stay beyond the limit (aka max size)
    },
    GuildTextThreadManager: 1,
    ThreadManager: 1,
    ThreadMemberManager: 0
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
