const { GuildMember, MessageEmbed, Message } = require("discord.js");
const fs = require('fs');

const Users = require('../../../../Moderation/Database/Schema/Users')

 /**
 * @param {GuildMember} member
 */


module.exports = async (member) => {
    let entry = await member.guild.fetchAuditLogs({type: 'MEMBER_KICK'}).then(audit => audit.entries.first());
    if(!entry || !entry.executor || entry.createdTimestamp <= Date.now() - 5000) return;
    await Users.updateOne({ id: entry.executor.id } , { $inc: { "Kullanimlar.Kick": 1 } }, { upsert: true }).exec();
}

module.exports.config = {
    Event: "guildMemberRemove"
}


const { Client } = require('discord.js');

