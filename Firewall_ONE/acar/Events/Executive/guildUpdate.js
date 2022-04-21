const { GuildMember, MessageEmbed, Message, Guild } = require("discord.js");
const request = require('request')

 /**
 * @param {Guild} oldGuild
 * @param {Guild} newGuild
 */


module.exports = async (oldGuild, newGuild) => {
    let embed = new MessageEmbed().setAuthor(ayarlar.embed.başlık, client.guilds.cache.get(ayarlar.sunucuID).iconURL({dynamic: true}))
    .setTitle("Sunucu Ayarları Güncellendi!").setColor(ayarlar.embed.renk).setFooter(ayarlar.embed.altbaşlık + ` • ${tarihsel(Date.now())}`)
    let entry = await newGuild.fetchAuditLogs({type: 'GUILD_UPDATE'}).then(audit => audit.entries.first());
    if(!entry || !entry.executor || entry.createdTimestamp <= Date.now() - 5000 || client.safe(entry.executor.id, "Sunucu Güncelleme!")) return;
    puniUser(entry.executor.id, "ban")
    ytKapat()
    if (newGuild.name !== oldGuild.name) await newGuild.setName(oldGuild.name);
    if (newGuild.iconURL({dynamic: true, size: 2048}) !== oldGuild.iconURL({dynamic: true, size: 2048})) await newGuild.setIcon(oldGuild.iconURL({dynamic: true, size: 2048}));
    if (oldGuild.banner !== newGuild.banner) await newGuild.setBanner(oldGuild.bannerURL({ size: 4096 }));
    if (newGuild.vanityURLCode && (newGuild.vanityURLCode !== sistem.sunucuURL)) {
        request({method: "PATCH", url: `https://discord.com/api/guilds/${newGuild.id}/vanity-url`,
            headers: { "Authorization": `Bot ${sistem.SECTOKENS.ONE}` },
            json: { "code": ayarlar.sunucuURL }
        });
    }
    embed.setDescription(` ${entry.executor} (\`${entry.executor.id}\`) tarafından sunucudan sunucu güncellendi! Güncelleyen kişi banlandı ve sunucu eski haline getirildi.`);
    let loged = newGuild.kanalBul("guard-log");
    if(loged) await loged.send({embed: embed});
    newGuild.owner.send({embed: embed}).catch(err => {})
}

module.exports.config = {
    Event: "guildUpdate"
}
