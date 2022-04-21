const { GuildMember, MessageEmbed } = require("discord.js");
const Punitives = require('../../../Database/Schema/Punitives');

 /**
 * @param {Guild} guild
 * @param {GuildMember} user
 */
module.exports = async (guild, user) => {
    let embed = new MessageEmbed().setAuthor(ayarlar.embed.başlık, client.guilds.cache.get(ayarlar.sunucuID).iconURL({dynamic: true})).setColor(ayarlar.embed.renk).setFooter(ayarlar.embed.altbaşlık)
    let entry = await guild.fetchAuditLogs({type: 'MEMBER_BAN_REMOVE'}).then(audit => audit.entries.first());
    if (!entry || !entry.executor) return;
    if(entry.executor.id == client.user.id) return;
    await Punitives.findOne({Uye: user.id, Tip: "Yasaklanma", Aktif: true}).exec(async (err, res) => {
        if(res) await Punitives.updateOne({ No: res.No }, { $set: { "Aktif": false, Bitis: Date.now(), Kaldiran: entry.executor.id } }, { upsert: true }).exec();
        await client.channels.cache.find(x => x.name == "ban-log").send(embed.setDescription(`${user} uyesinin sunucudaki ${res ? `\`#${res.No}\` ceza numaralı yasaklaması` : "yasaklaması"}, **${tarihsel(Date.now())}** tarihinde ${entry.executor} tarafından kaldırıldı.`))
    })
 }

module.exports.config = {
    Event: "guildBanRemove"
}
