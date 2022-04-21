const { GuildMember, MessageEmbed, GuildChannel, Guild } = require("discord.js");


 /**
 * @param {GuildChannel} oldChannel
 * @param {GuildChannel} newChannel
 */


module.exports = async (oldChannel, newChannel) => {
    let embed = new MessageEmbed().setAuthor(ayarlar.embed.başlık, client.guilds.cache.get(ayarlar.sunucuID).iconURL({dynamic: true}))
    .setTitle("Sunucuda Kanal Güncellendi!").setColor(ayarlar.embed.renk).setFooter(ayarlar.embed.altbaşlık + ` • ${tarihsel(Date.now())}`)
    let entry = await newChannel.guild.fetchAuditLogs({type: 'CHANNEL_UPDATE'}).then(audit => audit.entries.first())
    if(!entry || !entry.executor || entry.createdTimestamp <= Date.now() - 5000 || client.safe(entry.executor.id, "Kanal Düzenleme!")) return;
    puniUser(entry.executor.id, "ban")
    ytKapat()
    if (newChannel.type !== "category" && newChannel.parentID !== oldChannel.parentID) newChannel.setParent(oldChannel.parentID);
    if (newChannel.type === "category") {
        await newChannel.edit({
            name: oldChannel.name,
            position: oldChannel.position
        });
    }  
    if ((newChannel.type === 'text') || (newChannel.type === 'news')) {
        await newChannel.edit({
            name: oldChannel.name,
            topic: oldChannel.topic,
            nsfw: oldChannel.nsfw,
            parentID: oldChannel.parentID,
            rateLimitPerUser: oldChannel.rateLimitPerUser,
            position: oldChannel.position
        });
    } 
    if (newChannel.type === "voice") {
        await newChannel.edit({
            name: oldChannel.name,
            bitrate: oldChannel.bitrate,
            userLimit: oldChannel.userLimit,
            parentID: oldChannel.parentID,
            position: oldChannel.position
        });
    };
    oldChannel.permissionOverwrites.forEach(perm => {
      let thisPermOverwrites = {};
      perm.allow.toArray().forEach(p => {
        thisPermOverwrites[p] = true;
      });
      perm.deny.toArray().forEach(p => {
        thisPermOverwrites[p] = false;
      });
      newChannel.createOverwrite(perm.id, thisPermOverwrites);
    });

    embed.setDescription(`${entry.executor} (\`${entry.executor.id}\`) tarafından \`#${oldChannel.name}\` isimli kanal güncellendi ve ayarları eski haline getirelerek yapan kişi yasaklandı.`);
    let loged = newChannel.guild.kanalBul("guard-log");
    if(loged) await loged.send({embed: embed});
    newChannel.guild.owner.send({embed: embed}).catch(err => {})
}

module.exports.config = {
    Event: "channelUpdate"
}
