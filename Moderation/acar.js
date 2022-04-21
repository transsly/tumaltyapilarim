const { acar, Mongo } = require('./Moderation.Client');
const { Websocket } = require('./Global.Webinterface');
const client = global.client = new acar({ fetchAllMembers: true})

let WEB_INTERFACE = (new Websocket("4939", client))

client.fetchCommands()
client.fetchEvents()

Mongo.Connect();

client.login(sistem.MODTOKEN);