const { acar, Mongo } = require('./Global.Client');
const { Stat, Monthly } = require('./Stat.Autoclean');
const client = global.client = new acar({ fetchAllMembers: true })

Mongo.Connect();
client.fetchEvents();
Stat.Clean();
Monthly.System();

client.login(sistem.STATTOKEN);

