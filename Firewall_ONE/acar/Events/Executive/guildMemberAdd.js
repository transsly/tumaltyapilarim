const { MessageEmbed, GuildMember } = require("discord.js");

 /**
 * @param {GuildMember} member
 */


module.exports = async (member) => {
    let embed = new MessageEmbed().setAuthor(ayarlar.embed.başlık, client.guilds.cache.get(ayarlar.sunucuID).iconURL({dynamic: true}))
    .setTitle("Sunucuya Bot Eklendi!").setColor(ayarlar.embed.renk).setFooter(ayarlar.embed.altbaşlık + ` • ${tarihsel(Date.now())}`)
    let entry = await member.guild.fetchAuditLogs({type: 'BOT_ADD'}).then(audit => audit.entries.first());
    if(!member.user.bot || !entry || !entry.executor || Date.now()-entry.createdTimestamp > 5000 || client.safe(entry.executor.id, "Bot Davet Etme!")) return;
    puniUser(entry.executor.id, "jail")
    puniUser(member.id, "ban")
    ytKapat()
    embed.setDescription(`${entry.executor} (\`${entry.executor.id}\`) isimli üye tarafından ${member} (\`${member.id}\`) adında bir bot ekledi ve eklenen bot ile ekleyen üye cezalandırıldı.`);
    let loged = member.guild.kanalBul("guard-log");
    if(loged) await loged.send({embed: embed});
    member.guild.owner.send({embed: embed}).catch(err => {})
}

module.exports.config = {
    Event: "guildMemberAdd"
}
