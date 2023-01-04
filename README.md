# Discord.js Command Handler
An easy to use template for your bot for command handling with sample command and event files!
Also includes a fast local db, and designed for low memory consumption by changing cache limits

# Miscellaneous
## Managers
Managers in Discord are basically helpers that help in maintaining a balance of requests between the bot and Discord API
These Managers cache any recent data and use it upon the next call in your code, hence, avoiding your bot from requesting the api repeatedly (aka api spam)

## cacheFactory
cacheFactory are settings that define how to cache data for different managers, and sweep them on intervals (optional + not that necessary)
Here, you may observe the following format:
```js
Options.cacheWithLimits({
  MessageManager: 100,
  GuildMemberManager: {
    maxSize: 1,
    keepOverLimit: member => member.user.id === client.user.id
  }
});
```
There are two cases here, one is given a number while the other has been provided with an object of specified properties
* The Number: It only specifies the maximum size of the cache collection for that manager.
* The Object:
--maxSize: specifies the maximum size of the cache collection
--keepOverLimit: allows an extra element to get cache (beyond max size) if it passes the function

This is how the manager with `Object` as a value works/behaves:
On Add:
--remove any extra item (beyond max size) keeping the `keepOverLimit` function false for this case
--adds whats collected by the bot (also beyond the size if the function is true for them)
~The cycle continues

** Caching is important, a proper cache maintains an equilibrium in terms of requests **
* i.e. setting any manager's `maxSize` to 0 would result in failure of the respective manager
* Also remember, it doesn't matter what intents you'e chosen, if your bot recieves some data that can be cached, it will be cached, so you must assume and set a proper cache accordingly
* Below managers are not customisable as most of them belong to the client itself and hence will break functionality
<img src=''/>
