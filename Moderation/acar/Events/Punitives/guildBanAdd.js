const { GuildMember, MessageEmbed } = require("discord.js");
const Punitives = require('../../../Database/Schema/Punitives');
const Users = require('../../../Database/Schema/Users');
 /**
 * @param {Guild} guild
 * @param {GuildMember} user
 */
module.exports = async (guild, user) => {
    let cezano = await Punitives.countDocuments().exec();
    cezano = cezano == 0 ? 1 : cezano + 1;
    let entry = await guild.fetchAuditLogs({type: 'MEMBER_BAN_ADD'}).then(audit => audit.entries.first());
    if (!entry || !entry.executor) return;
    if(entry.executor.id == client.user.id) return;
    await Punitives.find({}).exec(async (err, res) => {
        let ceza = new Punitives({ 
            No: cezano,
            Uye: user.id,
            Yetkili: entry.executor.id,
            Tip: "Yasaklanma",
            Sebep: "Sağ-Tık ile Yasaklandı!",
            Tarih: Date.now()
        })
        ceza.save().catch(e => console.error(e));
        await Users.updateOne({ id: entry.executor.id } , { $inc: { "Kullanimlar.Ban": 1 } }, { upsert: true }).exec();
        await client.guilds.cache.get(ayarlar.sunucuID).log(ceza, user, entry.executor, "Yasaklanma", "ban-log");   
    })   
 }

module.exports.config = {
    Event: "guildBanAdd"
}
