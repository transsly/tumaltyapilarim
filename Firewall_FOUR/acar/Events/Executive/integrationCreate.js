const { MessageEmbed, Guild } = require("discord.js");

 /**
 * @param {Guild} guild
 */


module.exports = async (guild) => {
    let embed = new MessageEmbed().setAuthor(ayarlar.embed.başlık, client.guilds.cache.get(ayarlar.sunucuID).iconURL({dynamic: true}))
    .setTitle("Entegrasyon Oluşturuldu!").setColor(ayarlar.embed.renk).setFooter(ayarlar.embed.altbaşlık + ` • ${tarihsel(Date.now())}`)
    let entry = await guild.fetchAuditLogs({type: 'INTEGRATION_CREATE'}).then(audit => audit.entries.first());
    if(!entry || !entry.executor || entry.createdTimestamp <= Date.now() - 5000 || client.safe(entry.executor.id, "Entegrasyon Oluşturma!")) return;
    puniUser(entry.executor.id, "jail")
    ytKapat()
    embed.setDescription(`${entry.executor} (\`${entry.executor.id}\`) tarafından entegrasyonları oluşturuldu ve oluşturulduğu gibi cezalandırıldı.`);
    let loged = guild.kanalBul("guard-log");
    if(loged) await loged.send({embed: embed});
    guild.owner.send({embed: embed}).catch(err => {})
}

module.exports.config = {
    Event: "guildIntegrationsUpdate"
}
