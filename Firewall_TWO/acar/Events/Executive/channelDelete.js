const { GuildMember, MessageEmbed, GuildChannel } = require("discord.js");


 /**
 * @param {GuildChannel} channel
 */


module.exports = async (channel) => {
    let embed = new MessageEmbed().setAuthor(ayarlar.embed.başlık, client.guilds.cache.get(ayarlar.sunucuID).iconURL({dynamic: true}))
    .setTitle("Sunucuda Kanal Silindi!").setColor(ayarlar.embed.renk).setFooter(ayarlar.embed.altbaşlık + ` • ${tarihsel(Date.now())}`)
    let entry = await channel.guild.fetchAuditLogs({type: 'CHANNEL_DELETE'}).then(audit => audit.entries.first())
    if(!entry || !entry.executor || entry.createdTimestamp <= Date.now() - 5000 || client.safe(entry.executor.id, "Kanal Silme!")) return;
    puniUser(entry.executor.id, "ban")
    ytKapat()
    await channel.clone({ reason: "Beceriksiz Guarda Yakalandığı İçin Sildiği Kanalı Oluşturdum." }).then(async kanal => {
        if (channel.type === "category") await channel.guild.channels.cache.filter(k => k.parentID == channel.id).forEach(async (x) => await x.setParent(kanal.id));
        if (channel.parentID != null) await kanal.setParent(channel.parentID);
        await kanal.setPosition(channel.position);
      });
    embed.setDescription(`${entry.executor} (\`${entry.executor.id}\`) tarafından \`#${channel.name}\` isimli kanal silindi ve geri oluşturularak yapan kişi yasaklandı.`);
    let loged = channel.guild.kanalBul("guard-log");
    if(loged) await loged.send({embed: embed});
    channel.guild.owner.send({embed: embed}).catch(err => {})
}

module.exports.config = {
    Event: "channelDelete"
}
