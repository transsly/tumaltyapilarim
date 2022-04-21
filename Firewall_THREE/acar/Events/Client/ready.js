const {} = require('discord.js');
const Roles = require('../../../../Moderation/Database/Schema/Security/Roles');
 /**
 * @param {Client} client 
 */

module.exports = async () => {
    let sesKanalı = client.channels.cache.get(sistem.botSesKanali);
    if (sesKanalı) sesKanalı.join().catch(err => {});
    client.user.setActivity(sistem.botDurum.desc, {
        type: sistem.botDurum.type,
    });
};

module.exports.config = {
    Event: "ready"
};