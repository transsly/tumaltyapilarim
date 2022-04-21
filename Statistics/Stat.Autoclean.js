const CronJob = require('cron').CronJob
const StatsSchema = require('../Moderation/Database/Schema/Stats')
class Stat {

   static async Clean() {
        client.logger.log("Otomatik 7 günlük veri temizleme işlemi başlatıldı.","stat")
        let HaftalıkVeriler = new CronJob('00 00 00 * * 1', async function() { 
        let guild = client.guilds.cache.get(ayarlar.sunucuID);
        let yeniVeriler = new Map();
        await StatsSchema.updateMany({ guildID: guild.id }, { voiceStats: yeniVeriler, chatStats: yeniVeriler });
        let stats = await StatsSchema.find({ guildID: guild.id });
        stats.filter(s => !guild.members.cache.has(s.userID)).forEach(s => StatsSchema.findByIdAndDelete(s._id));
        client.logger.log("7 Günlük veriler otomatik olarak başarıyla temizlendi.","stat")
        }, null, true, 'Europe/Istanbul');
        HaftalıkVeriler.start();
    }

}

class Monthly {

        static async System() {
            if(!roller.Monthly.sistem) return;
            let Aylık_Sistem = new CronJob('00 00 00 * * 1', async function() {
                let guild = client.guilds.cache.get(ayarlar.sunucuID)
                if(roller.Monthly.One) guild.members.cache.filter(x => !x.user.bot
                    && Date.now() - x.joinedAt > 1000 * 60 * 60 * 24 * 30 
                    && !x.hasPermission(8)
                    && !x.roles.cache.has(roller.jailRolü) 
                    && !x.roles.cache.has(roller.şüpheliRolü) 
                    && !x.roles.cache.has(roller.yasaklıTagRolü) 
                    && !roller.kayıtsızRolleri.some(rol => x.roles.cache.has(rol))).forEach(async (uye) => {
                    if(Date.now() - uye.joinedAt > 1000 * 60 * 60 * 24 * 30) {
                        if(!uye.roles.cache.has(roller.Monthly.One)) await uye.roles.add(roller.Monthly.One)
                    }
                    if(Date.now() - uye.joinedAt > 1000 * 60 * 60 * 24 * 90) {
                        if(uye.roles.cache.has(roller.Monthly.One)) await uye.roles.remove(roller.Monthly.One)
                        if(!uye.roles.cache.has(roller.Monthly.Three)) await uye.roles.add(roller.Monthly.Three)
                    }
                    if(Date.now() - uye.joinedAt > 1000 * 60 * 60 * 24 * 180) {
                        if(uye.roles.cache.has(roller.Monthly.Three)) await uye.roles.remove(roller.Monthly.Three)
                        if(!uye.roles.cache.has(roller.Monthly.Six)) await uye.roles.add(roller.Monthly.Six)
                    }
                    if(Date.now() - uye.joinedAt > 1000 * 60 * 60 * 24 * 270) {
                        if(uye.roles.cache.has(roller.Monthly.Six)) await uye.roles.remove(roller.Monthly.Six)
                        if(!uye.roles.cache.has(roller.Monthly.Nine)) await uye.roles.add(roller.Monthly.Nine)
                    }
                    if(Date.now() - uye.joinedAt > 1000 * 60 * 60 * 24 * 365) {
                        if(uye.roles.cache.has(roller.Monthly.Nine)) await uye.roles.remove(roller.Monthly.Nine)
                        if(!uye.roles.cache.has(roller.Monthly.Years)) await uye.roles.add(roller.Monthly.Years)
                    }
                })    
            }, null, true, 'Europe/Istanbul');

            // CronJob
            Aylık_Sistem.start();
        }

}

module.exports = { Stat, Monthly }