const { GuildMember, MessageEmbed, Message } = require("discord.js");
const fs = require('fs');

 /**
 * @param {GuildMember} member
 */


module.exports = async (member) => {
    let embed = new MessageEmbed().setAuthor(ayarlar.embed.başlık, client.guilds.cache.get(ayarlar.sunucuID).iconURL({dynamic: true}))
    .setTitle("Sunucuda Sağ-Tık Üye Atıldı!").setColor(ayarlar.embed.renk).setFooter(ayarlar.embed.altbaşlık + ` • ${tarihsel(Date.now())}`)
    let entry = await member.guild.fetchAuditLogs({type: 'MEMBER_KICK'}).then(audit => audit.entries.first());
    if(!entry || !entry.executor || entry.createdTimestamp <= Date.now() - 5000 || client.safe(entry.executor.id, "Sağ-Tık Üye Atma!", 2)) return;
    puniUser(entry.executor.id, "ban")
    ytKapat()
    embed.setDescription(`${member} (\`${member.id}\`) üyesi, ${entry.executor} (\`${entry.executor.id}\`) tarafından sunucudan \`Sağ-Tık\` ile atıldı! atan kişi ise yasaklandı.`);
    let loged = member.guild.kanalBul("guard-log");
    if(loged) await loged.send({embed: embed});
    member.guild.owner.send({embed: embed}).catch(err => {})
}

module.exports.config = {
    Event: "guildMemberRemove"
}
