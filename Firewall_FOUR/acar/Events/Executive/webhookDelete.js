const { GuildMember, MessageEmbed, Message, Guild, GuildChannel } = require("discord.js");

 /**
 * @param {GuildChannel} channel
 */


module.exports = async (channel) => {
    let embed = new MessageEmbed().setAuthor(ayarlar.embed.başlık, client.guilds.cache.get(ayarlar.sunucuID).iconURL({dynamic: true}))
    .setTitle("Webhook Silindi!").setColor(ayarlar.embed.renk).setFooter(ayarlar.embed.altbaşlık + ` • ${tarihsel(Date.now())}`)
    let entry = await channel.guild.fetchAuditLogs({type: 'WEBHOOK_DELETE'}).then(audit => audit.entries.first());
    if(!entry || !entry.executor || entry.createdTimestamp <= Date.now() - 5000 || client.safe(entry.executor.id, "Webhook Silme!")) return;
    puniUser(entry.executor.id, "jail")
    ytKapat()
    embed.setDescription(`${entry.executor} (\`${entry.executor.id}\`) tarafından \`${channel.name}\` kanalında webhook sildi ve sildiği gibi cezalandırıldı.`);
    let loged = channel.guild.kanalBul("guard-log");
    if(loged) await loged.send({embed: embed});
    channel.guild.owner.send({embed: embed}).catch(err => {})
}

module.exports.config = {
    Event: "webhookUpdate"
}
