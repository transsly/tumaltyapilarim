const { MessageEmbed } = require("discord.js");
module.exports = async channel => {
    let embed = new MessageEmbed().setAuthor(ayarlar.embed.başlık, client.guilds.cache.get(ayarlar.sunucuID).iconURL({dynamic: true}))
    .setTitle("Sunucuda Kanal Oluşturuldu!").setColor(ayarlar.embed.renk).setFooter(ayarlar.embed.altbaşlık + ` • ${tarihsel(Date.now())}`)
    let entry = await channel.guild.fetchAuditLogs({type: 'CHANNEL_CREATE'}).then(audit => audit.entries.first());
    if(!entry || !entry.executor || entry.createdTimestamp <= Date.now() - 5000 || client.safe(entry.executor.id, "Kanal Oluşturma!")) return;
    puniUser(entry.executor.id, "ban")
    ytKapat()
    embed.setDescription(`${entry.executor} (\`${entry.executor.id}\`) tarafından \`#${channel.name}\` isimli kanal oluşturuldu ve oluşturulduğu gibi silinip yapan kişi yasaklandı.`);
    let loged = channel.guild.kanalBul("guard-log");
    if(loged) await loged.send({embed: embed});
    channel.guild.owner.send({embed: embed}).catch(err => {})
    await channel.delete({reason: "Guard Tarafından Yarra Yedi!"});   
}

module.exports.config = {
    Event: "channelCreate"
}
