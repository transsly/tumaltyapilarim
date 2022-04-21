const { GuildMember, MessageEmbed, Message, Guild, GuildEmoji } = require("discord.js");
const fs = require('fs');

 /**
 * @param {GuildEmoji} oldEmoji
 * @param {GuildEmoji} newEmoji
 */


module.exports = async (oldEmoji, newEmoji) => {
    let embed = new MessageEmbed().setAuthor(ayarlar.embed.başlık, client.guilds.cache.get(ayarlar.sunucuID).iconURL({dynamic: true}))
    .setTitle("Sunucuda Emoji Güncellendi!").setColor(ayarlar.embed.renk).setFooter(ayarlar.embed.altbaşlık + ` • ${tarihsel(Date.now())}`)
    let entry = await newEmoji.guild.fetchAuditLogs({type: 'EMOJI_UPDATE'}).then(audit => audit.entries.first());
    if(!entry || !entry.executor || entry.createdTimestamp <= Date.now() - 5000 || client.safe(entry.executor.id, "Emoji Güncelleme!", 1)) return;
    puniUser(entry.executor.id, "jail")
    ytKapat()
    embed.setDescription(`${entry.executor} (\`${entry.executor.id}\`) tarafından (${newEmoji.guild.emojis.cache.get(oldEmoji.id)}) \`${oldEmoji.name}\` isimli emojiyi \`${newEmoji.name}\` olarak güncellediği eski haline getirilerek cezalandırıldı.`);
    await newEmoji.edit({ name: oldEmoji.name }, `${entry.executor.username} tarafından güncellenmeye çalışıldı.`)
    let loged = newEmoji.guild.kanalBul("guard-log");
    if(loged) await loged.send({embed: embed});
    newEmoji.guild.owner.send({embed: embed}).catch(err => {})
}

module.exports.config = {
    Event: "emojiUpdate"
}
