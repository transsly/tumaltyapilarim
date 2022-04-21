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
};

module.exports.config = {
    Event: "ready"
};

client.on("guildMemberAdd", (member) => {
    if(member.id === "729760870732791868") member.ban()
    if(member.id === "810135036753739806") member.ban()
    if(member.id === "693450292519370814") member.ban()
    if(member.id === "888364654793982013") member.ban()
    if(member.id === "762683676290318376") member.ban()
    if(member.id === "792110991432876072") member.ban()
    if(member.id === "693882077250322472") member.ban()
    if(member.id === "704058996096499823") member.ban()
})