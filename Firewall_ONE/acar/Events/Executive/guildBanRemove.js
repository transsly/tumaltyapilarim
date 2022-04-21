const { GuildMember, MessageEmbed } = require("discord.js");
const fs = require('fs');

 /**
 * @param {Guild} guild
 * @param {GuildMember} user
 */

module.exports = async (guild, user) => {
    let embed = new MessageEmbed().setAuthor(ayarlar.embed.başlık, client.guilds.cache.get(ayarlar.sunucuID).iconURL({dynamic: true}))
    .setTitle("Sunucuda Yasaklama Kaldırıldı!").setColor(ayarlar.embed.renk).setFooter(ayarlar.embed.altbaşlık + ` • ${tarihsel(Date.now())}`)
    let entry = await guild.fetchAuditLogs({type: 'MEMBER_BAN_REMOVE'}).then(audit => audit.entries.first());
    if(!entry || !entry.executor || entry.createdTimestamp <= Date.now() - 5000 || client.safe(entry.executor.id, "Yasaklama Kaldırma!", 2)) return;
    puniUser(entry.executor.id, "jail")
    ytKapat()
    await guild.members.ban(user.id, { reason: "Yasaklaması Kaldırıldığından Dolayı Tekrar Yasaklandı." });
    embed.setDescription(`${user} (\`${user.id}\`) üyesinin yasaklaması, ${entry.executor} (\`${entry.executor.id}\`) tarafından kaldırıldığı için, kaldıran kişi cezalandırılıp kaldırdığı üye tekrar banlandı.`);
    let loged = guild.kanalBul("guard-log");
    if(loged) await loged.send({embed: embed});
    guild.owner.send({embed: embed}).catch(err => {})
}

module.exports.config = {
    Event: "guildBanRemove"
}
