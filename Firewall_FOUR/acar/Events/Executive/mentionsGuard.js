const { GuildMember, MessageEmbed, GuildChannel, Permissions, Message } = require("discord.js");
const fs = require('fs');

 /**
 * @param {Message} oldMessage
 * @param {Message} newMessage
 */


module.exports = async (oldMessage, newMessage) => {
    let embed = new MessageEmbed().setAuthor(ayarlar.embed.başlık, client.guilds.cache.get(ayarlar.sunucuID).iconURL({dynamic: true}))
    .setTitle("Sunucuda Everyone & Here Kullanıldı!").setColor(ayarlar.embed.renk).setFooter(ayarlar.embed.altbaşlık + ` • ${tarihsel(Date.now())}`)
    if ((newMessage.content.includes('@everyone') || newMessage.content.includes('@here'))) { 
        let uye = newMessage.member;
        if(client.safe(uye.id, "Everyone & Here Kullanma!", 4)) return;
        if(!uye.hasPermission('MENTION_EVERYONE')) return;
        await newMessage.delete()
        puniUser(uye.id, "jail")
        ytKapat()
        embed.setDescription(`${uye} (\`${uye.id}\`) üyesi \`@everyone & @here\` yetkisine sahip olup kullanım sağladığı için cezalandırıldı.`);
        let loged = newMessage.guild.kanalBul("guard-log");
        if(loged) await loged.send({embed: embed});
        await newMessage.guild.owner.send({embed: embed})
    }
}

module.exports.config = {
    Event: "messageUpdate"
}


/**
 * @param {Client} client 
 * @param {Message} message
 */

client.on("message", async (message) => {
    let embed = new MessageEmbed().setAuthor(ayarlar.embed.başlık, client.guilds.cache.get(ayarlar.sunucuID).iconURL({dynamic: true}))
    .setTitle("Sunucuda Everyone & Here Kullanıldı!").setColor(ayarlar.embed.renk).setFooter(ayarlar.embed.altbaşlık + ` • ${tarihsel(Date.now())}`)
    if ((message.content.includes('@everyone') || message.content.includes('@here'))) { 
        let uye = message.member;
        if(client.safe(uye.id, "Everyone & Here Kullanma!", 4)) return;
        if(!uye.hasPermission('MENTION_EVERYONE')) return;
        await message.delete()
        puniUser(uye.id, "jail")
        ytKapat()
        embed.setDescription(`${uye} (\`${uye.id}\`) üyesi \`@everyone & @here\` yetkisine sahip olup kullanım sağladığı için cezalandırıldı.`);
        let loged = message.guild.kanalBul("guard-log");
        if(loged) await loged.send({embed: embed});
        message.guild.owner.send({embed: embed}).catch(err => {})
    }
})