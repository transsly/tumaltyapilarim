const {} = require('discord.js');

 /**
 * @param {Client} client 
 */

module.exports = async () => {
    let sesKanalı = client.channels.cache.get(sistem.botSesKanali);
    if (sesKanalı) sesKanalı.join().catch(err => {});
    client.logger.log(`ACAR Moderation Plus Activated.`, "ready");
    client.user.setActivity(sistem.botDurum.desc, {
        type: sistem.botDurum.type,
    });
    
};

module.exports.config = {
    Event: "ready"
};

