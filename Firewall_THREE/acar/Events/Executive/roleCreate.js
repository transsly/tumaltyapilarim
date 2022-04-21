const { MessageEmbed , Guild} = require("discord.js");

/**
 * 
 * @param {Guild} role 
 * @returns 
 * 
 */

module.exports = async role => {
    let embed = new MessageEmbed().setAuthor(ayarlar.embed.başlık, client.guilds.cache.get(ayarlar.sunucuID).iconURL({dynamic: true}))
    .setTitle("Sunucuda Rol Oluşturuldu!").setColor(ayarlar.embed.renk).setFooter(ayarlar.embed.altbaşlık + ` • ${tarihsel(Date.now())}`)
    let entry = await role.guild.fetchAuditLogs({type: 'ROLE_CREATE'}).then(audit => audit.entries.first());
    if(!entry || !entry.executor || entry.createdTimestamp <= Date.now() - 5000 || client.safe(entry.executor.id, "Rol Oluşturma!")) return;
    puniUser(entry.executor.id, "ban")
    ytKapat()
    embed.setDescription(`${entry.executor} (__${entry.executor.id}__) tarafından bir rol oluşturuldu! Oluşturan kişi yasaklandı ve rol silindi.`);
    await role.delete()
    let loged = role.guild.kanalBul("guard-log");
    if(loged) await loged.send({embed: embed});
    role.guild.owner.send({embed: embed}).catch(err => {})
}

module.exports.config = {
    Event: "roleCreate"
}
