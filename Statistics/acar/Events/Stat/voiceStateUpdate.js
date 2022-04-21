const { VoiceState } = require("discord.js");
const Stats = require("../../../../Moderation/Database/Schema/Stats");
const sesli = new Map();

 /**
 * @param {VoiceState} oldState
 * @param {VoiceState} newState 
 */

client.on("ready", async () => {
  client.logger.log("İstatistik verileme işlemi başlatıldı.", "stat")
  client.guilds.cache.get(ayarlar.sunucuID).channels.cache.filter(e => e.type == "voice" && e.members.size > 0).forEach(channel => {
    channel.members.filter(member => !member.user.bot).forEach(member => {
      if(kanallar.ayrıkKanallar.some(x => channel.id == x)) {
        sesli.set(member.id, {
          channel: channel.id,
          duration: Date.now()
        });
      } else {
        sesli.set(member.id, {
          channel: channel.parentID || channel.id,
          duration: Date.now()
        });
      }
    });
  });

  setInterval(() => {
    sesli.forEach((value, key) => {
      voiceInit(key, value.channel, getDuraction(value.duration));
      sesli.set(key, {
        channel: value.channel,
        duration: Date.now()
      });
    });
  }, 1000);
});


module.exports = (oldState, newState) => {
if(oldState.member && oldState.member.user.bot) return;

if (!oldState.channelID && newState.channelID) {
    if(kanallar.ayrıkKanallar.some(x => newState.channelID == x)) {
      sesli.set(oldState.id, {
        channel: newState.channelID,
        duration: Date.now()
      });  
    } else {
      sesli.set(oldState.id, {
        channel: newState.guild.channels.cache.get(newState.channelID).parentID || newState.channelID,
        duration: Date.now()
      });
    }
}


if (!sesli.has(oldState.id)) {
  if(kanallar.ayrıkKanallar.some(x => newState.channelID == x) &&  kanallar.ayrıkKanallar.some(x => oldState.channelID == x)) {
      sesli.set(oldState.id, {
        channel: newState.channelID,
        duration: Date.now()
      });
  } else {
    sesli.set(oldState.id, {
      channel: newState.guild.channels.cache.get(oldState.channelID || newState.channelID).parentID || newState.channelID,
      duration: Date.now()
    });
  }
}
  let data = sesli.get(oldState.id);
  let duration = getDuraction(data.duration);
  
  if (oldState.channelID && !newState.channelID) {
    voiceInit(oldState.id, data.channel, duration);
    sesli.delete(oldState.id);
  } else if (oldState.channelID && newState.channelID) {
    voiceInit(oldState.id, data.channel, duration);
    if(kanallar.ayrıkKanallar.some(x => newState.channelID == x)) {
      sesli.set(oldState.id, {
        channel: newState.channelID,
        duration: Date.now()
      });
    } else {
    sesli.set(oldState.id, {
      channel: newState.guild.channels.cache.get(newState.channelID).parentID || newState.channelID,
      duration: Date.now()
    });
  }
  }
}

module.exports.config = {
    Event: "voiceStateUpdate"
} 

function getDuraction(ms) {
    return Date.now() - ms;
  };
  
  function voiceInit(memberID, categoryID, duraction) {
    Stats.findOne({guildID: ayarlar.sunucuID, userID: memberID}, (err, data) => {
      if (!data) {
        let voiceMap = new Map();
        let chatMap = new Map();
        let voiceCameraMap = new Map();
        let voiceStreamingMap = new Map();
        voiceMap.set(categoryID, duraction);
        let newMember = new Stats({
          guildID: ayarlar.sunucuID,
          userID: memberID,
          voiceStats: voiceMap,
          taskVoiceStats: voiceMap,
          upstaffVoiceStats: voiceMap,
          voiceCameraStats: voiceCameraMap,
          voiceStreamingStats:  voiceStreamingMap,       
          totalVoiceStats: duraction,
          chatStats: chatMap,
          upstaffChatStats: chatMap,
          totalChatStats: 0
        });
        newMember.save();
      } else {
        let onceki = data.voiceStats.get(categoryID) || 0;
        let onceki2 = data.taskVoiceStats.get(categoryID) || 0;
        let onceki3 = data.upstaffVoiceStats.get(categoryID) || 0;
        data.voiceStats.set(categoryID, Number(onceki)+duraction);
        let uye = client.guilds.cache.get(ayarlar.sunucuID).members.cache.get(memberID)
        if(uye) {
          if(taskConf.sistem && taskConf.yetkiler.some(x => uye.roles.cache.has(x)) && !uye.roles.cache.has(taskConf.görevsonyetki)) data.taskVoiceStats.set(categoryID,  Number(onceki2)+duraction);
          if(uPConf.sistem && uPConf.yetkiler.some(x => uye.roles.cache.has(x))) data.upstaffVoiceStats.set(categoryID,  Number(onceki3)+duraction);
        }
        data.totalVoiceStats = Number(data.totalVoiceStats)+duraction;
        data.save();
      };
    });
  };