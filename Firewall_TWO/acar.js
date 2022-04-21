const { acar, Mongo } = require('./Global.Client');
const client = global.client = new acar({ fetchAllMembers: true })

Mongo.Connect();
client.fetchEvents();

client.login(sistem.SECTOKENS.TWO);

