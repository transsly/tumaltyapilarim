const { MessageEmbed, Collection } = require('discord.js');
const Users = require('../../../Database/Schema/Users');
const Upstaffs = require('../../../Database/Schema/Upstaffs');
const { Upstaff } = require('../../../Database/acarDatabase');
const Stats = require('../../../Database/Schema/Stats');
const Taskdata = require('../../../Database/Schema/Managements');
 /**
 * @param {Client} client 
 */

module.exports = async (member) => {
    if(member.guild.id !== ayarlar.sunucuID) return;
    if(member.roles.cache.has(roller.jailRolü) || member.roles.cache.has(roller.şüpheliRolü) || member.roles.cache.has(roller.yasaklıTagRolü) || (roller.kayıtsızRolleri && roller.kayıtsızRolleri.some(rol => member.roles.cache.has(rol)))) return;
    let User = await Users.findOne({ id: member.id })
    if(uPConf.sistem) await Upstaffs.findByIdAndDelete(member.id)
    if(taskConf.yetkiler.some(x => member.roles.cache.has(x)) && !member.roles.cache.has(taskConf.görevsonyetki)) await Taskdata.findByIdAndDelete(member.id)
    await Stats.updateOne({ userID: member.id }, { upstaffVoiceStats: new Map(), upstaffChatStats: new Map() });
    if(User) {

        // (üye yetkili ise çıktığında yetkisini datadan çek)
        if(User.Yetkilimi) {
            let Yetkili = await Users.findOne({id: User.Yetkiekleyen}) || {}
            if(Yetkili) {
                let babanıSikim = member.guild.members.cache.get(User.Yetkiekleyen)
                let findUser = await Yetkili.Yetkililer.find(acar => acar.id == member.id);
                if(findUser) await Users.updateOne({ id: User.Yetkiekleyen }, { $pull: { "Yetkililer": findUser } }, { upsert: true })
                if(taskConf.sistem && babanıSikim && taskConf.yetkiler.some(x => babanıSikim.roles.cache.has(x)) && !babanıSikim.roles.cache.has(taskConf.görevsonyetki)) await babanıSikim.taskAdd("Yetkili", -1).catch(x => {})
                if(coinConf.sistem && babanıSikim) await babanıSikim.coinAdd(-coinConf.Ödül.Yetkili)
            }
            await Users.updateOne({ id: member.id }, { $set: { "Yetkilimi": false, "Yetkiekleyen": new String() } }, { upsert: true }).exec(); 
        }

        // (üye taglıysa ve bi kişiye aitse datadan temizleme)
        if(User.Taglandı)  {
            let SikimAnani = await Users.findOne({id: User.Taglayan}) || {}
            if(SikimAnani) {
                let babanıSikim = member.guild.members.cache.get(User.Taglayan)
                let findUser = await SikimAnani.Taglılar.find(acar => acar.id == member.id);
                if(findUser) await Users.updateOne({ id: User.Taglayan }, { $pull: { "Taglılar": findUser } }, { upsert: true })
                if(uPConf.sistem) await Upstaff.addPoint(User.Taglayan, -uPConf.odül.taglı, "Taglı")
                if(taskConf.sistem && babanıSikim && taskConf.yetkiler.some(x => babanıSikim.roles.cache.has(x)) && !babanıSikim.roles.cache.has(taskConf.görevsonyetki)) await babanıSikim.taskAdd("Taglı", -1).catch(x => {})
                if(coinConf.sistem && babanıSikim) await babanıSikim.coinAdd(-coinConf.Ödül.Taglı)
            }
            await Users.updateOne({ id: member.id }, { $set: { "Taglandı": false, "Taglayan": new String() } }, { upsert: true }).exec();
        }

        // Sunucudan ayrılma olarak ekle
        await Users.updateOne({ id: member.id }, { $push: { "Isimler": { Zaman: Date.now(), Isim: User.Isim, Yas: User.Yas, islembilgi: "Sunucudan Ayrılma" } } }, { upsert: true }).exec();
    }
    

};

module.exports.config = {
    Event: "guildMemberRemove"
};
