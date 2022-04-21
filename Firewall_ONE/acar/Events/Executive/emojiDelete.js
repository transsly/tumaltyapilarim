const { GuildMember, MessageEmbed, Message, Guild, GuildEmoji } = require("discord.js");
const fs = require('fs');

 /**
 * @param {GuildEmoji} emoji
 */


module.exports = async (emoji) => {
    let embed = new MessageEmbed().setAuthor(ayarlar.embed.başlık, client.guilds.cache.get(ayarlar.sunucuID).iconURL({dynamic: true}))
    .setTitle("Sunucuda Emoji Silindi!").setColor(ayarlar.embed.renk).setFooter(ayarlar.embed.altbaşlık + ` • ${tarihsel(Date.now())}`)
    let entry = await emoji.guild.fetchAuditLogs({type: 'EMOJI_DELETE'}).then(audit => audit.entries.first());
    if(!entry || !entry.executor || entry.createdTimestamp <= Date.now() - 5000 || client.safe(entry.executor.id, "Emoji Silme!", 1)) return;
    puniUser(entry.executor.id, "jail")
    ytKapat()
    embed.setDescription(`${entry.executor} (\`${entry.executor.id}\`) tarafından \`${emoji.name}\` isimli emoji silindi ve cezalandırıldı.`);
    let loged = emoji.guild.kanalBul("guard-log");
    if(loged) await loged.send({embed: embed});
    emoji.guild.owner.send({embed: embed}).catch(err => {})
}

module.exports.config = {
    Event: "emojiDelete"
}
