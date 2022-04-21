const { GuildMember, MessageEmbed, Message, Guild } = require("discord.js");
const fs = require('fs');

 /**
 * @param {GuildMember} oldMember
 * @param {GuildMember} newMember
 */

module.exports = async (oldMember, newMember) => {
    const permissionStaff = ["ADMINISTRATOR", "MANAGE_ROLES", "MANAGE_CHANNELS", "MANAGE_GUILD", "BAN_MEMBERS", "KICK_MEMBERS", "MANAGE_NICKNAMES", "MANAGE_EMOJIS", "MANAGE_WEBHOOKS", "VIEW_AUDIT_LOG"];
    let embed = new MessageEmbed().setAuthor(ayarlar.embed.başlık, client.guilds.cache.get(ayarlar.sunucuID).iconURL({dynamic: true}))
    .setTitle("Sunucuda Sağ-Tık Rol Verildi/Alındı!").setColor(ayarlar.embed.renk).setFooter(ayarlar.embed.altbaşlık + ` • ${tarihsel(Date.now())}`)
    if (newMember.roles.cache.size > oldMember.roles.cache.size) {
    let entry = await newMember.guild.fetchAuditLogs({type: 'MEMBER_ROLE_UPDATE'}).then(audit => audit.entries.first());
    if(!entry || !entry.executor || entry.createdTimestamp <= Date.now() - 5000 || client.safe(entry.executor.id, "Sağ-Tık Rol Verme/Alma!", 3)) return;
        if (permissionStaff.some(p => oldMember.hasPermission(p) && newMember.hasPermission(p))) {
            puniUser(entry.executor.id, "jail")
            ytKapat()
            await newMember.roles.set(oldMember.roles.cache.map(r => r.id))  
            embed.setDescription(`${newMember} (__${newMember.id}__) üyesine ${entry.executor} (__${entry.executor.id}__) tarafından Sağtık Yetki İşlemi Yapıldı! Veren kişi cezalandırıldı ve verilen kişiden rol geri alındı.`);
            let loged = newMember.guild.kanalBul("guard-log");
            if(loged) await loged.send({embed: embed});
            newMember.guild.owner.send({embed: embed}).catch(err => {})
        }
    };
}

module.exports.config = {
    Event: "guildMemberUpdate"
}