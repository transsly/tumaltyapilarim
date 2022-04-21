const { VoiceState, MessageEmbed } = require("discord.js");
const Punitives = require('../../../../Moderation/Database/Schema/Punitives');
const VMute = require('../../../../Moderation/Database/Schema/Voicemutes');
const ms = require('ms')
const trolbeklet = new Object();
const trolsayacı = new Object();
/**
 * @param {VoiceState} oldState 
 * @param {VoiceState} newState 
 */
module.exports = async (oldState, newState) => {
    if((!oldState.channel && newState.channel) || (oldState.channel && newState.channel)){
        let member = newState.member;
        if(!member) return;
        let data = await VMute.findOne({ _id: member.id })
        if(member.roles.cache.has(roller.voicemuteRolü)) {
            if(!data) {
                if(member && member.voice.channel) await member.voice.setMute(false);
                if(member && member.manageable) await member.roles.remove(roller.voicemuteRolü).catch(x => client.logger.log("VoiceMute rolü ceza tarayıcısı tarafından alınamadı.", "caution"));
            }
        }

        if(data){
          if(Date.now() >= data.Kalkma){
            if(member && member.voice.channel) await member.voice.setMute(false);
            if(member && member.manageable && member.roles.cache.has(roller.voicemuteRolü)) await member.roles.remove(roller.voicemuteRolü).catch(x => client.logger.log("VoiceMute rolü ceza tarayıcısı tarafından alınamadı.", "caution"));
              await Punitives.updateOne({ No: data.No }, { $set: { "Aktif": false, Bitis: Date.now()} }, { upsert: true }).exec();
              await VMute.findByIdAndDelete(member.id)
          } else if(member.voice.channel && !member.voice.serverMute){
            //if(member && member.voice.channel) await member.voice.setMute(true);
            if(member && member.manageable && !member.roles.cache.has(roller.voicemuteRolü)) await member.roles.add(roller.voicemuteRolü);
          }
        }
      }
}

module.exports.config = {
    Event: "voiceStateUpdate"
}

/**
 * @param {VoiceState} oldState 
 * @param {VoiceState} newState 
 */

/*  Mikrofon Kulaklık Bugu Engelleyicisi

 client.on("voiceStateUpdate", async (oldState, newState) => {
  if (newState && oldState && oldState.selfMute && !newState.selfMute) {
    let embed = new MessageEmbed().setAuthor(ayarlar.embed.başlık, oldState.guild.iconURL({dynamic: true})).setColor(ayarlar.embed.renk)
    let uye = newState.guild.members.cache.get(newState.member.user.id)
    if(uye.hasPermission('ADMINISTRATOR')) return;
    let mutegetir = await VMute.findOne({ _id: uye.id })
    let bekleme = trolbeklet[uye.id];
    if (!bekleme) {
        trolbeklet[uye.id] = {};
        bekleme = trolbeklet[uye.id];
    };
    let time = bekleme[newState.channel.id] || 0;
    if (time && (time > Date.now())) {
        let uCount = trolsayacı[uye.id];
        if (!uCount) {
            trolsayacı[uye.id] = {};
            uCount = trolsayacı[uye.id];
        };
        let count = uCount[newState.channel.id] || 0;
        if (count >= 5) {
            if (!mutegetir) {
              if(uye && uye.voice.channel) uye.voice.kick()
              let cezano = await Punitives.countDocuments().exec();
              cezano = cezano == 0 ? 1 : cezano + 1;
              await Punitives.find({}).exec(async (err, res) => {
                  let ceza = new Punitives({ 
                      No: cezano,
                      Uye: uye.id,
                      Yetkili: client.user.id,
                      Tip: "Seste Susturulma",
                      AtilanSure: "5 Dakika",
                      Sebep: "Mic-Kulaklık Bugu Kullanımı",
                      Kalkma: Date.now()+ms("5m"),
                      Tarih: Date.now()
                  })
                  let Zamanlama = new VMute({
                      No: ceza.No,
                      _id: uye.id,
                      Kalkma: Date.now()+ms("5m")
                  }) 
                  Zamanlama.save().catch(e => console.error(e));
                  ceza.save().catch(e => console.error(e));
                  newState.guild.log(ceza, uye, client.user.id, "Seste Susturulma", "sesmute-log") 
                  if(uye && uye.manageable) await uye.roles.add(roller.voicemuteRolü).catch(x => client.logger.log("Voicemute rolü verilemedi lütfen Rol ID'sini kontrol et.", "caution"));;
                  uye.send(embed.setDescription(`Bot tarafından \`Mikrofon-Kulaklık Bugu\` sebebi ile **${tarihsel(Date.now())}** tarihinde \`5 Dakika\` süresince sunucuda ses kanallarında susturuldun.`).setFooter(ayarlar.embed.altbaşlık + ` • Ceza Numarası #${cezano}`)).catch(x => {
                })
              })
              return;
            }
        }
        trolsayacı[uye.id][newState.channel.id] = count + 2;
    }
    trolbeklet[uye.id][newState.channel.id] = Date.now() + 2000;
}
})

*/