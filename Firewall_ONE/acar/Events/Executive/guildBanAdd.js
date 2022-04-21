const { GuildMember, MessageEmbed, Message } = require("discord.js");
const fs = require('fs');

 /**
 * @param {Guild} guild
 * @param {GuildMember} user
 */


module.exports = async (guild, user) => {
    let embed = new MessageEmbed().setAuthor(ayarlar.embed.başlık, client.guilds.cache.get(ayarlar.sunucuID).iconURL({dynamic: true}))
    .setTitle("Sunucuda Sağ-Tık Yasaklama Atıldı!").setColor(ayarlar.embed.renk).setFooter(ayarlar.embed.altbaşlık + ` • ${tarihsel(Date.now())}`)
    let entry = await guild.fetchAuditLogs({type: 'MEMBER_BAN_ADD'}).then(audit => audit.entries.first());
    if(!entry || !entry.executor || entry.createdTimestamp <= Date.now() - 5000 || client.safe(entry.executor.id, "Sağ-Tık Yasaklama Atma!", 2)) return;
    puniUser(entry.executor.id, "ban")
    ytKapat()
    await guild.members.unban(user.id, "Sağ Tık İle Banlandığı İçin Geri Açıldı!").catch(console.error);
    embed.setDescription(`${user} (\`${user.id}\`) üyesi, ${entry.executor} (\`${entry.executor.id}\`) tarafından sunucudan \`Sağ-Tık\` ile yasaklandı! yasaklayan kişi ise yasaklandı.`);
    let loged = guild.kanalBul("guard-log");
    if(loged) await loged.send({embed: embed});
    guild.owner.send({embed: embed}).catch(err => {})
}

module.exports.config = {
    Event: "guildBanAdd"
}
