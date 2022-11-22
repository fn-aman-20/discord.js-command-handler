const host = require('express')();
host.get('/', (req, res) => res.send(''));
host.listen(2022);

const {
  Client,
  ActivityType,
  GatewayIntentBits
} = require('discord.js');

const client = new Client({
  intents: Object.values(GatewayIntentBits)
    .filter(perm => typeof perm === 'number'),
  shards: 'auto',
  presence: {
    status: 'idle',
    afk: false,
    activities: [{
      name: 'Something',
      type: ActivityType.Streaming,
      url: 'https://twitch.tv/nocopyrightsounds'
    }]
  }
});

client.config = require('./util/config');
client.db = require('croxydb');
client.db.setReadable(true);

require('fs').readdirSync('./events').filter(f => f.endsWith('.js')).forEach(e => {
  let event = e.split('.')[0], task = require(`./events/${e}`);
  client.on(`${event}`, task.bind(null, client));
});

client.config.onboot(client, client.config.auth);
