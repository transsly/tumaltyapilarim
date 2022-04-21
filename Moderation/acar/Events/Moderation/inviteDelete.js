const {} = require('discord.js');

 /**
 * @param {Client} client 
 */

module.exports = (invite) => {
    let gi = client.Invites.get(invite.guild.id);
    gi.delete(invite.code);
    client.Invites.set(invite.guild.id, gi);
};

module.exports.config = {
    Event: "inviteDelete"
};