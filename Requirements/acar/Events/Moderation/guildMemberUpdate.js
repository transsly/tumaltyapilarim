const { User } = require("discord.js");
const roller = require('../../../../Moderation/Database/Schema/AuditRoles')
 /**
 * @param {User} oldMember 
 * @param {User} newMember
 */
module.exports = async (oldMember, newMember) => {
    await newMember.guild.fetchAuditLogs({
        type: "MEMBER_ROLE_UPDATE"
    }).then(async (audit) => {
        let ayar = audit.entries.first()
        let hedef = ayar.target
        let yapan = ayar.executor
        if (yapan.bot) return
        if(newMember.roles.cache.has(roller.jailRolü) || newMember.roles.cache.has(roller.şüpheliRolü) || newMember.roles.cache.has(roller.yasaklıTagRolü) || (roller.kayıtsızRolleri && roller.kayıtsızRolleri.some(rol => newMember.roles.cache.has(rol)))) return;
        newMember.roles.cache.forEach(async role => {
            if (!oldMember.roles.cache.has(role.id)) {
                roller.findOne({
                    user: hedef.id
                }, async (err, res) => {
                    if (!res) {
                        let arr = []
                        arr.push({
                            rol: role.id,
                            mod: yapan.id,
                            tarih: Date.parse(new Date().toLocaleString("tr-TR", {
                                timeZone: "Asia/Istanbul"
                            })),
                            state: "Ekleme"
                        })
                        let newData = new roller({
                            user: hedef.id,
                            roller: arr
                        })
                        newData.save().catch(e => console.log(e))
                    } else {
                        res.roller.push({
                            rol: role.id,
                            mod: yapan.id,
                            tarih: Date.parse(new Date().toLocaleString("tr-TR", {
                                timeZone: "Asia/Istanbul"
                            })),
                            state: "Ekleme"
                        })
                        res.save().catch(e => console.log(e))
                    }
                })
            }
        });
        oldMember.roles.cache.forEach(async role => {
            if (!newMember.roles.cache.has(role.id)) {
                roller.findOne({
                    user: hedef.id
                }, async (err, res) => {
                    if (!res) {
                        let arr = []
                        arr.push({
                            rol: role.id,
                            mod: yapan.id,
                            tarih: Date.parse(new Date().toLocaleString("tr-TR", {
                                timeZone: "Asia/Istanbul"
                            })),
                            state: "Kaldırma"
                        })
                        let newData = new roller({
                            user: hedef.id,
                            roller: arr
                        })
                        newData.save().catch(e => console.log(e))
                    } else {
                        res.roller.push({
                            rol: role.id,
                            mod: yapan.id,
                            tarih: Date.parse(new Date().toLocaleString("tr-TR", {
                                timeZone: "Asia/Istanbul"
                            })),
                            state: "Kaldırma"
                        })
                        res.save().catch(e => console.log(e))
                    }
                })
            }
        });
    })
}

module.exports.config = {
    Event: "guildMemberUpdate"
}