const {} = require("discord.js");

const { Upstaff } = require("../../../../Moderation/Database/acarDatabase");


 /**
 * @param {Client} client
 */


module.exports = () => {
    client.logger.log("Upstaff sistemi başlatıldı artık otomatik olarak odaları tarıyor.","ups")
    let guild = client.guilds.cache.get(ayarlar.sunucuID);
    setInterval( async () => {
        let channels = guild.channels.cache.filter(channel => channel.type == "voice" && channel.members.size > 0 && channel.parent && uPConf.izinliKategoriler.includes(channel.parentID));
        channels.forEach(channel => {
            let members = channel.members.filter(member => !member.user.bot && !member.voice.selfDeaf && uPConf.yetkiler.some(x => member.roles.cache.has(x)));
            members.forEach(async (member) => {
                if(member.roles.cache.has(roller.jailRolü) || member.roles.cache.has(roller.şüpheliRolü) || member.roles.cache.has(roller.yasaklıTagRolü) || (roller.kayıtsızRolleri && roller.kayıtsızRolleri.some(rol => member.roles.cache.has(rol)))) return;
                if(!member.user.username.includes(ayarlar.tag) && !member.roles.cache.has(roller.tagRolü)) return;
                if(kanallar.ayrıkKanallar.some(x => channel.id == x)) {
                    await Upstaff.addPoint(member.id, uPConf.odül.yarıses, "Ses", channel.id)
                    return;
                }

                if(uPConf.tamPuanKategoriler.includes(channel.parentID)) {
                    if(member.voice.selfMute) { await Upstaff.addPoint(member.id, uPConf.odül.yarıses, "Ses", channel.parentID) 
                        } else { await Upstaff.addPoint(member.id, uPConf.odül.ses, "Ses", channel.parentID) }
                    } 
                else { await Upstaff.addPoint(member.id, uPConf.odül.yarıses, "Ses", channel.parentID) }
            });
        });
    }, uPConf.kacmilisaniyesonra);
}

module.exports.config = {
    Event: "ready"
}