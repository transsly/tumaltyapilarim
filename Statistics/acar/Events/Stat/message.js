const { Message, MessageEmbed } = require("discord.js");
const Stats = require('../../../../Moderation/Database/Schema/Stats');

 /**
 * @param {Message} message 
 */

module.exports = async (message) => {
 if (message.author.bot || !message.guild || message.webhookID || message.channel.type === "dm" || message.content.startsWith(sistem.prefix)) return;
  Stats.findOne({ guildID: message.guild.id, userID: message.author.id }, (err, data) => {
    let kanalID = message.channel.parentID || message.channel.id;
    if (!data) {
      let voiceMap = new Map();
      let chatMap = new Map();
      let voiceCameraMap = new Map();
      let voiceStreamingMap = new Map();
      chatMap.set(kanalID, 1);
      let newMember = new Stats({
        guildID: message.guild.id,
        userID: message.author.id,
        voiceStats: voiceMap,
        taskVoiceStats: voiceMap,
        upstaffVoiceStats: voiceMap,
        voiceCameraStats: voiceCameraMap,
        voiceStreamingStats:  voiceStreamingMap,     
        totalVoiceStats: 0,
        chatStats: chatMap,
        upstaffChatStats: chatMap,
        totalChatStats: 1
      });
      newMember.save();
    } else {
      let onceki = data.chatStats.get(kanalID) || 0;
      let onceki2 = data.upstaffChatStats.get(kanalID) || 0;
      data.chatStats.set(kanalID, Number(onceki)+1);
      if(uPConf.sistem && uPConf.yetkiler.some(x => message.member.roles.cache.has(x))) data.upstaffChatStats.set(kanalID, Number(onceki2)+1);
      data.totalChatStats++;
      data.save();
    };
  });
}

module.exports.config = {
    Event: "message"
}