const { GuildMember, MessageEmbed, GuildChannel } = require("discord.js");


 /**
 * @param {GuildChannel} oldChannel
 * @param {GuildChannel} newChannel
 */


module.exports = async (oldChannel, newChannel) => {
    let embed = new MessageEmbed().setAuthor(ayarlar.embed.başlık, client.guilds.cache.get(ayarlar.sunucuID).iconURL({dynamic: true}))
    .setTitle("Sunucuda Kanal İzni Oluşturuldu!").setColor(ayarlar.embed.renk).setFooter(ayarlar.embed.altbaşlık + ` • ${tarihsel(Date.now())}`)
    let entry = await newChannel.guild.fetchAuditLogs({type: 'CHANNEL_OVERWRITE_CREATE'}).then(audit => audit.entries.first())
    if(!entry || !entry.executor || entry.createdTimestamp <= Date.now() - 5000 || client.safe(entry.executor.id, "Kanal İzni Oluşturma!")) return;
    puniUser(entry.executor.id, "ban")
    ytKapat()
    embed.setDescription(`${entry.executor} (\`${entry.executor.id}\`) tarafından \`#${oldChannel.name}\` isimli kanalda izin oluşturdu ve yasaklandı.`);
    let loged = newChannel.guild.kanalBul("guard-log");
    if(loged) await loged.send({embed: embed});
    newChannel.guild.owner.send({embed: embed}).catch(err => {})
}

module.exports.config = {
    Event: "channelUpdate"
}
