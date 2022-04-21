const {} = require("discord.js");

const { Upstaff } = require("../../../../Moderation/acar/Functions/Global.Task");


 /**
 * @param {Client} client
 */


module.exports = () => {
    client.logger.log("Yetkili puan sistemi başlatıldı artık otomatik olarak odaları tarıyor.","ups")
    let guild = client.guilds.cache.get(ayarlar.sunucuID);
    setInterval( async () => {
        let channels = guild.channels.cache.filter(channel => channel.type == "voice" && channel.members.size > 0 && channel.parent && uPConf.izinliKategoriler.includes(channel.parentID));
        channels.forEach(channel => {
            let members = channel.members.filter(member => !member.user.bot && !member.voice.selfDeaf && taskConf.yetkiler.some(x => member.roles.cache.has(x)));
            members.forEach(async (member) => {
                if(member.roles.cache.has(roller.jailRolü) || member.roles.cache.has(roller.şüpheliRolü) || member.roles.cache.has(roller.yasaklıTagRolü) || (roller.kayıtsızRolleri && roller.kayıtsızRolleri.some(rol => member.roles.cache.has(rol)))) return;
                if(!member.user.username.includes(ayarlar.tag) && !member.roles.cache.has(roller.tagRolü)) return;
                if(kanallar.ayrıkKanallar.some(x => channel.id == x)) {
                    await member.taskAdd("Ses", taskConf.puanlama.sesPuan / 2)
                    return;
                }

                if(uPConf.tamPuanKategoriler.includes(channel.parentID)) {
                    if(member.voice.selfMute) { await member.taskAdd("Ses", taskConf.puanlama.sesPuan / 2) 
                        } else { await member.taskAdd("Ses") }
                    } 
                else { await member.taskAdd("Ses", taskConf.puanlama.sesPuan / 2) }
            });
        });
    }, uPConf.kacmilisaniyesonra);
}

module.exports.config = {
    Event: "ready"
}