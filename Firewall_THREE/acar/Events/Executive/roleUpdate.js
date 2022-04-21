const { MessageEmbed , Guild} = require("discord.js");

/**
 * @param {Guild} oldRole
 * @param {Guild} newRole 
 */

module.exports = async (oldRole, newRole) => {
    const permissionStaff = ["ADMINISTRATOR", "MANAGE_ROLES", "MANAGE_CHANNELS", "MANAGE_GUILD", "BAN_MEMBERS", "KICK_MEMBERS", "MANAGE_NICKNAMES", "MANAGE_EMOJIS", "MANAGE_WEBHOOKS", "VIEW_AUDIT_LOG"];
    let embed = new MessageEmbed().setAuthor(ayarlar.embed.başlık, client.guilds.cache.get(ayarlar.sunucuID).iconURL({dynamic: true}))
    .setTitle("Sunucuda Rol Güncellendi!").setColor(ayarlar.embed.renk).setFooter(ayarlar.embed.altbaşlık + ` • ${tarihsel(Date.now())}`)
    let entry = await newRole.guild.fetchAuditLogs({type: 'ROLE_UPDATE'}).then(audit => audit.entries.first());
    if(!entry || !entry.executor || entry.createdTimestamp <= Date.now() - 5000 || client.safe(entry.executor.id, "Rol Düzenleme!")) return;
    puniUser(entry.executor.id, "ban")
    ytKapat()
    if (permissionStaff.some(p => !oldRole.permissions.has(p) && newRole.permissions.has(p))) {
        newRole.setPermissions(oldRole.permissions);
        newRole.guild.roles.cache.filter(r => !r.managed && (r.permissions.has("ADMINISTRATOR") || r.permissions.has("MANAGE_ROLES") || r.permissions.has("MANAGE_GUILD"))).forEach(r => r.setPermissions(36818497));
      };
      await newRole.edit({
        name: oldRole.name,
        color: oldRole.hexColor,
        hoist: oldRole.hoist,
        permissions: oldRole.permissions,
        mentionable: oldRole.mentionable
      });
    embed.setDescription(`${entry.executor} (__${entry.executor.id}__) tarafından **${oldRole.name}** rolü güncellendi! Güncelleyen kişi yasaklandı ve rol eski haline getirildi.`);
    let loged = newRole.guild.kanalBul("guard-log");
    if(loged) await loged.send({embed: embed});
    newRole.guild.owner.send({embed: embed}).catch(err => {})
}

module.exports.config = {
    Event: "roleUpdate"
}