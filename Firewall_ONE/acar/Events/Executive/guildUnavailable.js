const { GuildMember, MessageEmbed, Message, Guild } = require("discord.js");

 /**
 * @param {Guild} guild
 */


module.exports = async (guild) => {
    let embed = new MessageEmbed().setAuthor(ayarlar.embed.başlık, client.guilds.cache.get(ayarlar.sunucuID).iconURL({dynamic: true}))
    .setTitle("Sunucu Kullanılmaz Halde").setColor(ayarlar.embed.renk).setFooter(ayarlar.embed.altbaşlık + ` • ${tarihsel(Date.now())}`)
    ytKapat()
    embed.setDescription(`Sunucu kullanılmaz hale getirildiği için otomatik olarak sunucu içerisindeki tüm yönetici, rol yönet, kanal yönet ve diğer izinleri tamamiyle kapattım.`);
    let loged = guild.kanalBul("guard-log");
    if(loged) await loged.send({embed: embed});
    guild.owner.send({embed: embed}).catch(err => {})
}

module.exports.config = {
    Event: "guildUnavailable"
}
