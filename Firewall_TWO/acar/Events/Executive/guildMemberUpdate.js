const { GuildMember, MessageEmbed, Message, Guild } = require("discord.js");
const fs = require('fs');

 /**
 * @param {GuildMember} oldMember
 * @param {GuildMember} newMember
 */

module.exports = async (oldMember, newMember) => {
      await newMember.guild.fetchAuditLogs({type: "MEMBER_ROLE_UPDATE"}).then(async (audit) => {
        let ayar = audit.entries.first()
        let hedef = ayar.target
        let yapan = ayar.executor
        let kanal = client.guilds.cache.get(ayarlar.sunucuID).kanalBul("sağ-tık-log");
        if(yapan.bot) return
        if(newMember.roles.cache.has(roller.jailRolü) || newMember.roles.cache.has(roller.şüpheliRolü) || newMember.roles.cache.has(roller.yasaklıTagRolü) || (roller.kayıtsızRolleri && roller.kayıtsızRolleri.some(rol => newMember.roles.cache.has(rol)))) return;
        newMember.roles.cache.forEach(async role => {
            if(!oldMember.roles.cache.has(role.id)) {
                const emed = new MessageEmbed().setAuthor(ayarlar.embed.başlık, client.guilds.cache.get(ayarlar.sunucuID).iconURL({dynamic: true}))
                .setTitle("Bir Üyeye Rol Verildi").setColor("GREEN").setFooter(ayarlar.embed.altbaşlık + ` • ${tarihsel(Date.now())}`)
                .setDescription(`${hedef} (\`${hedef.id}\`) kişisine ${role} isimli rol sağ tık ile ${yapan} (\`${yapan.id}\`) tarafından eklendi.`)
                if(kanal) kanal.send(emed)
            }
        });
        oldMember.roles.cache.forEach(async role => {
            if(!newMember.roles.cache.has(role.id)) {
                const emeed = new MessageEmbed().setAuthor(ayarlar.embed.başlık, client.guilds.cache.get(ayarlar.sunucuID).iconURL({dynamic: true}))
                .setTitle("Bir Üyeden Rol Alındı").setColor("RED").setFooter(ayarlar.embed.altbaşlık + ` • ${tarihsel(Date.now())}`)
                .setDescription(`${hedef} (\`${hedef.id}\`) kişisine ${role} isimli rol sağ tık ile ${yapan} (\`${yapan.id}\`) tarafından geri alındı.`)
                if(kanal) kanal.send(emeed)
            }
        });
    }) 
}

module.exports.config = {
    Event: "guildMemberUpdate"
}
