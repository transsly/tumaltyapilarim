const { GuildMember, MessageEmbed, Message, Guild, GuildChannel } = require("discord.js");

 /**
 * @param {GuildChannel} channel
 */


module.exports = async (channel) => {
    let embed = new MessageEmbed().setAuthor(ayarlar.embed.başlık, client.guilds.cache.get(ayarlar.sunucuID).iconURL({dynamic: true}))
    .setTitle("Webhook Oluşturuldu!").setColor(ayarlar.embed.renk).setFooter(ayarlar.embed.altbaşlık + ` • ${tarihsel(Date.now())}`)
    let entry = await channel.guild.fetchAuditLogs({type: 'WEBHOOK_CREATE'}).then(audit => audit.entries.first());
    if(!entry || !entry.executor || entry.createdTimestamp <= Date.now() - 5000 || client.safe(entry.executor.id, "Webhook Oluşturma!")) return;
    puniUser(entry.executor.id, "jail")
    ytKapat()
    embed.setDescription(`${entry.executor} (\`${entry.executor.id}\`) tarafından \`${channel.name}\` kanalında webhook oluşturuldu ve oluşturulduğu gibi silinip cezalandırıldı.`);
    const webhooks = await channel.fetchWebhooks();
        webhooks.forEach(async element => {
            await element.delete()
        });
    let loged = channel.guild.kanalBul("guard-log");
    if(loged) await loged.send({embed: embed});
    channel.guild.owner.send({embed: embed}).catch(err => {})
}

module.exports.config = {
    Event: "webhookUpdate"
}
