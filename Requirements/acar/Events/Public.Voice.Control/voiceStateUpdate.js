const { VoiceState } = require("discord.js");
const voiceAfks = new Map();
const ms = require('ms');
const sure = "10m"
/**
 * @param {VoiceState} oldState 
 * @param {VoiceState} newState 
 */

module.exports = async (oldState, newState) => {
    let member = oldState.member;
    if(!member) return;
    if(member.user.bot) return;
    if(oldState.channelID && !newState.channelID) await voiceAfks.delete(member.id)
    if(oldState.guild.channels.cache.get(oldState.channelID || newState.channelID).parentID != kanallar.publicKategorisi) return;
    if(member.voice.selfDeaf || member.voice.selfMute) {
             voiceAfks.set(member.id, { channel: oldState.channelID, date: Date.now()+ms(sure) });
        } else {
             await voiceAfks.delete(member.id);
    } 

}

module.exports.config = {
    Event: "voiceStateUpdate"
}

client.on("ready", async () => {
    client.guilds.cache.get(ayarlar.sunucuID).channels.cache.filter(e => 
        e.type == "voice" && 
        e.members.size > 0 &&
        e.parentID == kanallar.publicKategorisi &&
        e.id != kanallar.sleepRoom).forEach(channel => {
        channel.members.filter(member => !member.user.bot && member.voice.selfDeaf || member.voice.selfMute).forEach(async (member) => {
                console.log(member.user.tag + "datata yok ekledim. afkya atıyorum.")
                if(!voiceAfks.get(member.id)) return voiceAfks.set(member.id, { channel: channel.id, date: Date.now()+ms(sure) });
        })
    }) 

    setInterval(() => {
        checkAfk()
    }, 5000);
});


async function checkAfk() {
    client.guilds.cache.get(ayarlar.sunucuID).channels.cache.filter(e => 
        e.type == "voice" && 
        e.members.size > 0 &&
        e.parentID == kanallar.publicKategorisi &&
        e.id != kanallar.sleepRoom).forEach(channel => {
        channel.members.filter(member => !member.user.bot && voiceAfks.get(member.id)).forEach(async (member) => {
                let data = voiceAfks.get(member.id);
                console.log(member.user.tag)
                    if(Date.now() >= data.date) {
                        await voiceAfks.delete(member.id);
                        if(member && member.voice.channel) return member.voice.setChannel(kanallar.sleepRoom)
                    }
        })
    }) 
}


