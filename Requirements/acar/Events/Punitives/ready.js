const {} = require('discord.js');
const { VoiceMutes, Mutes, Jails } = require('../../../../Moderation/acar/Functions/Moderation.TempPunitives');

 /**
 * @param {Client} client 
 */

module.exports = async () => {
    setTimeout(() => {
        client.logger.log(`Punitives data in checking started.`, "event");
    }, 1000)
    setInterval(() => {
        VoiceMutes.Scan()
        Mutes.Scan();
        Jails.Scan();
    }, 15000);

};

module.exports.config = {
    Event: "ready"
};