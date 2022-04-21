const { MessageEmbed, Collection } = require('discord.js');
const Invite = require('../../../../Moderation/Database/Schema/Invites');
const { Upstaff } = require('../../../../Moderation/Database/acarDatabase');

 /**
 * @param {Client} client 
 */

module.exports = async (member) => {
    let isMemberFake = (Date.now() - member.user.createdTimestamp) < 7*24*60*60*1000;
    let inviteChannel = client.channels.cache.get(kanallar.davetKanalı);
    Invite.findOne({ guildID: member.guild.id, userID: member.id }, async (err, memberData) => {
      if (memberData && memberData.inviterID) {
        let inviter = client.users.cache.get(memberData.inviterID) || {id: member.guild.id};
        Invite.findOne({ guildID: member.guild.id, userID: memberData.inviterID }, async (err, inviterData) => {
          if (!inviterData) {
           let newInviter = new Invite({
              guildID: member.guild.id,
              userID: inviter.id,
              inviterID: null,
              regular: 0,
              bonus: 0,
              fake: 0
            });
            newInviter.save();
          } else {
            if (isMemberFake) {
              if (inviterData.fake-1 >= 0) inviterData.fake--;
            } else {
              if (inviterData.regular-1 >= 0) inviterData.regular--;
            };
            inviterData.save().then(async (x) => {
              if (inviteChannel) inviteChannel.send(`${member.guild.emojiGöster(emojiler.Iptal)} \`${member.user.tag}\` ayrıldı! ${inviter.tag ? `**Davet eden**: ${inviter.id == member.guild.id ? member.guild.name : inviter.tag} (**${(x.regular ? x.regular : 0)+(x.bonus ? x.bonus : 0)}** davet)` : `Davetçi bulunamadı!`}`).catch(err => {});
              if(inviter) {
                if(uPConf.sistem) await Upstaff.addPoint(inviter.id, -uPConf.odül.invite, "Invite")
                let ananıSikeyim = member.guild.members.cache.get(inviter.id)
		if(ananıSikeyim && taskConf.sistem && taskConf.yetkiler.some(x => ananıSikeyim.roles.cache.has(x)) && !ananıSikeyim.roles.cache.has(taskConf.görevsonyetki)) await ananıSikeyim.taskAdd("Invite", -1).catch(x => {})
                if(coinConf.sistem && ananıSikeyim) await ananıSikeyim.coinAdd(-coinConf.Ödül.Invite)
              }
            });
          };
        });
      } else {
        if (inviteChannel) inviteChannel.send(`${member.guild.emojiGöster(emojiler.Iptal)} \`${member.user.tag}\` ayrıldı!`).catch(err => {});
      };
    });
};

module.exports.config = {
    Event: "guildMemberRemove"
};
