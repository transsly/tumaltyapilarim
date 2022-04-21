const { acar, Mongo, Executive } = require('./Global.Client');
const client = global.client = new acar({ fetchAllMembers: true })

setInterval(async () => {
    await Executive.Roles()
}, 1000*60*60*1)

Mongo.Connect();
client.fetchEvents();

client.login(sistem.SECTOKENS.THREE);

