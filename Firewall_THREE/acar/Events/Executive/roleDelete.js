const { MessageEmbed , Guild} = require("discord.js");

/**
 * @param {Guild} role 
 */

module.exports = async role => {
    let embed = new MessageEmbed().setAuthor(ayarlar.embed.başlık, client.guilds.cache.get(ayarlar.sunucuID).iconURL({dynamic: true}))
    .setTitle("Sunucuda Rol Silindi!").setColor(ayarlar.embed.renk).setFooter(ayarlar.embed.altbaşlık + ` • ${tarihsel(Date.now())}`)
    let entry = await role.guild.fetchAuditLogs({type: 'ROLE_DELETE'}).then(audit => audit.entries.first());
    if(!entry || !entry.executor || entry.createdTimestamp <= Date.now() - 5000 || client.safe(entry.executor.id, "Rol Silme!")) return;
    puniUser(entry.executor.id, "ban")
    ytKapat()
    embed.setDescription(`${entry.executor} (\`${entry.executor.id}\`) tarafından **@${role.name}** (\`${role.id}\`) isimli rol silindi ve yapan kişi yasaklandı.\n**NOT:** Rol otomatik olarak kurulmadı, kurulum yapmak için: \`${sistem.prefix}rolkur ${role.id}\` komutunu kullanabilirsiniz.`);
    let loged = role.guild.kanalBul("guard-log");
    if(loged) await loged.send({embed: embed});
    role.guild.owner.send({embed: embed}).catch(err => {})
}

module.exports.config = {
    Event: "roleDelete"
}