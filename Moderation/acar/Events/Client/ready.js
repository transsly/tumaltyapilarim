const {} = require('discord.js');

 /**
 * @param {Client} client 
 */

module.exports = async () => {
    let sesKanalı = client.channels.cache.get(sistem.botSesKanali);
    if (sesKanalı) sesKanalı.join().catch(err => {});
    client.user.setActivity(sistem.botDurum.desc, {
        type: sistem.botDurum.type,
    });
    client.guilds.cache.forEach(guild => {
      guild.fetchInvites().then(_invites => {
          client.Invites.set(guild.id, _invites);
      }).catch(err => { client.logger.log(`Invite taraması yaparken hata oluştu lütfen kontrol edin.`, "event"); });
  });
};

module.exports.config = {
    Event: "ready"
};