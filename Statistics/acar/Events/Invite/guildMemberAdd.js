const { MessageEmbed, Collection } = require('discord.js');

const Invite = require('../../../../Moderation/Database/Schema/Invites');
const { Upstaff } = require('../../../../Moderation/Database/acarDatabase');

client.on("inviteCreate", async invite => client.Invites.set(invite.guild.id, await invite.guild.fetchInvites()));
client.on("inviteDelete", invite => setTimeout(async () => { client.Invites.set(invite.guild.id, await invite.guild.fetchInvites()); }, 5000));


 /**
 * @param {Client} client 
 */

module.exports = async (member) => {
    if(member.bot) return;
    let cachedInvites = client.Invites.get(member.guild.id);
    let newInvites = await member.guild.fetchInvites();
    let usedInvite = newInvites.find(inv => cachedInvites.has(inv.code) && cachedInvites.get(inv.code).uses < inv.uses) || cachedInvites.find(inv => !newInvites.has(inv.code)) || {code: member.guild.vanityURLCode, uses: null, inviter: {id: null}};
    let inviter = client.users.cache.get(usedInvite.inviter.id) || {id: member.guild.id};
    let isMemberFake = (Date.now() - member.user.createdTimestamp) < 7*24*60*60*1000;
    let inviteChannel = client.channels.cache.get(kanallar.davetKanalı);
    Invite.findOne({ guildID: member.guild.id, userID: member.id }, (err, joinedMember) => {
      if (!joinedMember) {
        let newJoinedMember = new Invite({
            guildID: member.guild.id,
            userID: member.id,
            inviterID: inviter.id,
            regular: 0,
            bonus: 0,
            fake: 0
        });
        newJoinedMember.save();
      } else {
        joinedMember.inviterID = inviter.id;
        joinedMember.save();
      };
    });
    if (isMemberFake) {
      Invite.findOne({ guildID: member.guild.id, userID: inviter.id }, (err, inviterData) => {
        if (!inviterData) {
          let newInviter = new Invite({
            guildID: member.guild.id,
            userID: inviter.id,
            inviterID: null,
            regular: 0,
            bonus: 0,
            fake: 1
          });
          newInviter.save().then(x => {
            if (inviteChannel) inviteChannel.send(`${member.guild.emojiGöster(emojiler.Onay)} ${member} isimli kişi, ${inviter.id == member.guild.id ? member.guild.name : inviter.tag} tarafından sunucuya davet edildi \`${(x.regular ? x.regular : 0)+(x.bonus ? x.bonus : 0)}\` toplam daveti bulunmakta.`).catch(err => {});
          });
        } else {
          inviterData.fake++
          inviterData.save().then(x => {
            if (inviteChannel) inviteChannel.send(`${member.guild.emojiGöster(emojiler.Onay)} ${member} isimli kişi, ${inviter.id == member.guild.id ? member.guild.name : inviter.tag} tarafından sunucuya davet edildi \`${(x.regular ? x.regular : 0)+(x.bonus ? x.bonus : 0)}\` toplam daveti bulunmakta.`).catch(err => {});
          });
        };
      });
    } else {
        Invite.findOne({ guildID: member.guild.id, userID: inviter.id }, (err, inviterData) => {
          if (!inviterData) {
            let newInviter = new Invite({
              guildID: member.guild.id,
              userID: inviter.id,
              inviterID: null,
              regular: 1,
              bonus: 0,
              fake: 0
            });
            newInviter.save().then(x => {
                if (inviteChannel) inviteChannel.send(`${member.guild.emojiGöster(emojiler.Onay)} ${member} isimli kişi, ${inviter.id == member.guild.id ? member.guild.name : inviter.tag} tarafından sunucuya davet edildi \`${(x.regular ? x.regular : 0)+(x.bonus ? x.bonus : 0)}\` toplam daveti bulunmakta.`).catch(err => {});
            });
          } else {
            inviterData.regular++;
            inviterData.save().then(x => {
                if (inviteChannel) inviteChannel.send(`${member.guild.emojiGöster(emojiler.Onay)} ${member} isimli kişi, ${inviter.id == member.guild.id ? member.guild.name : inviter.tag} tarafından sunucuya davet edildi \`${(x.regular ? x.regular : 0)+(x.bonus ? x.bonus : 0)}\` toplam daveti bulunmakta.`).catch(err => {});
            });
          };
        });
    };
    if(inviter) {
        if(uPConf.sistem) await Upstaff.addPoint(inviter.id, uPConf.odül.invite, "Invite")
        let ananıSikeyim = member.guild.members.cache.get(inviter.id)
	if(ananıSikeyim && taskConf.sistem && taskConf.yetkiler.some(x => ananıSikeyim.roles.cache.has(x)) && !ananıSikeyim.roles.cache.has(taskConf.görevsonyetki)) await ananıSikeyim.taskAdd("Invite", 1).catch(x => {})
        if(coinConf.sistem && ananıSikeyim) await ananıSikeyim.coinAdd(coinConf.Ödül.Invite)
    }
    client.Invites.set(member.guild.id, newInvites);
};

module.exports.config = {
    Event: "guildMemberAdd"
};
