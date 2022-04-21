const { GuildMember, MessageEmbed, GuildChannel, Permissions } = require("discord.js");


 /**
 * @param {GuildChannel} oldChannel
 * @param {GuildChannel} newChannel
 */


module.exports = async (oldChannel, newChannel) => {
    let embed = new MessageEmbed().setAuthor(ayarlar.embed.başlık, client.guilds.cache.get(ayarlar.sunucuID).iconURL({dynamic: true}))
    .setTitle("Sunucuda Kanal İzni Güncellendi!").setColor(ayarlar.embed.renk).setFooter(ayarlar.embed.altbaşlık + ` • ${tarihsel(Date.now())}`)
    let entry = await newChannel.guild.fetchAuditLogs({type: 'CHANNEL_OVERWRITE_UPDATE'}).then(audit => audit.entries.first())
    if(!entry || !entry.executor || entry.createdTimestamp <= Date.now() - 5000 || client.safe(entry.executor.id, "Kanal İzni Düzenleme!")) return;
    puniUser(entry.executor.id, "ban")
    ytKapat()
    oldChannel.permissionOverwrites.forEach(async (perm) => {
      let thisPermOverwrites = {};
      perm.allow.toArray().forEach(p => {
        thisPermOverwrites[p] = true;
      });
      perm.deny.toArray().forEach(p => {
        thisPermOverwrites[p] = false;
      });
      newChannel.createOverwrite(perm.id, thisPermOverwrites);
    });
    embed.setDescription(`${entry.executor} (\`${entry.executor.id}\`) tarafından \`#${oldChannel.name}\` isimli kanalda izni düzenledi ve yasaklandı.`);
    let loged = newChannel.guild.kanalBul("guard-log");
    if(loged) await loged.send({embed: embed});
    newChannel.guild.owner.send({embed: embed}).catch(err => {})
}

module.exports.config = {
    Event: "channelUpdate"
}
