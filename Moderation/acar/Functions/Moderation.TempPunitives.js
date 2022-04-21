const VMute = require('../../Database/Schema/Voicemutes');
const Mute = require('../../Database/Schema/Mutes');
const Jail = require('../../Database/Schema/Jails');
const Punitives = require('../../Database/Schema/Punitives');
const Users = require('../../Database/Schema/Users');

class Jails {
  static async Scan() {
    let Cezalı = await Jail.find()
      for (let ceza of Cezalı) {
          let uye = client.guilds.cache.get(ayarlar.sunucuID).members.cache.get(ceza._id);
          if (uye && ceza.Kalkma && Date.now() >= ceza.Kalkma) {
            await Jail.deleteOne({id: ceza._id})
            if(await Punitives.findOne({No: ceza.No})) await Punitives.updateOne({ No: ceza.No }, { $set: { "Aktif": false, Bitis: Date.now()} }, { upsert: true }).exec();
            let CID = await Users.findOne({ id: uye.id }) || [];
            if(CID) { if(CID.Cinsiyet && CID.Isim && CID.Yas) {
              if(uye && uye.manageable) await uye.setNickname(`${uye.user.username.includes(ayarlar.tag) ? ayarlar.tag : (ayarlar.tagsiz ? ayarlar.tagsiz : (ayarlar.tag || ""))} ${CID.Isim} | ${CID.Yas}`)
              if(!ayarlar.taglıalım || uye.user.username.includes(ayarlar.tag)) {
                if(CID.Cinsiyet == "erkek") await uye.rolTanımla(roller.erkekRolleri)
                if(CID.Cinsiyet == "kadın") await uye.rolTanımla(roller.kadınRolleri)
                if(CID.Cinsiyet == "kayıtsız") await uye.rolTanımla(roller.kayıtsızRolleri).catch(x => client.logger.log("Jailler ceza tarayıcısı tarafından tarandı cezası kaldırıldı fakat kayıtsız rolü verilemedi.", "caution"));
                if(uye && uye.manageable && uye.user.username.includes(ayarlar.tag)) await uye.roles.add(roller.tagRolü)
              } else {
                if(uye && uye.manageable) await uye.rolTanımla(roller.kayıtsızRolleri).catch(x => client.logger.log("Jailler ceza tarayıcısı tarafından tarandı fakat isim verisi bulamadığından kayıtsız rolü verilemedi.", "caution"));
            }}
              if(!CID && !CID.Cinsiyet && !CID.Isim && !CID.Yas) await uye.rolTanımla(roller.kayıtsızRolleri).catch(x => client.logger.log("Jailler ceza tarayıcısı tarafından tarandı fakat isim verisi bulamadığından kayıtsız rolü verilemedi.", "caution"));
              if(!CID && !CID.Isim && !CID.Yas) await uye.setNickname(`${uye.user.username.includes(ayarlar.tag) ? ayarlar.tag : (ayarlar.tagsiz ? ayarlar.tagsiz : (ayarlar.tag || ""))} İsim | Yaş`)

            }
          } else {
            if(uye && uye.manageable) await uye.rolTanımla(roller.jailRolü).catch(x => {});
          };
        };
  }
}

class VoiceMutes {
    static async Scan() {
      let Sesmute = await VMute.find()
        for (let ceza of Sesmute) {
            let uye = client.guilds.cache.get(ayarlar.sunucuID).members.cache.get(ceza._id);
            if (ceza.Kalkma && Date.now() >= ceza.Kalkma) {
              if(uye && uye.voice.channel) await uye.voice.setMute(false);
              if(uye && uye.manageable) await uye.roles.remove(roller.voicemuteRolü).catch(x => client.logger.log("VoiceMute rolü ceza tarayıcısı tarafından alınamadı.", "caution"));
              if(await Punitives.findOne({No: ceza.No})) await Punitives.updateOne({ No: ceza.No }, { $set: { "Aktif": false, Bitis: Date.now()} }, { upsert: true }).exec();
              await VMute.findByIdAndDelete(ceza._id)
            } else {
              if(uye && uye.manageable) await uye.roles.add(roller.voicemuteRolü).catch(x => client.logger.log("VoiceMute rolü ceza tarayıcısı tarafından eklenemedi.", "caution"));
            };
          };
    }
}

class Mutes {
  static async Scan() {
    let Muteler = await Mute.find()
      for (let ceza of Muteler) {
          let uye = client.guilds.cache.get(ayarlar.sunucuID).members.cache.get(ceza._id);
          if (ceza.Kalkma && Date.now() >= ceza.Kalkma) {
            if(uye && uye.manageable) await uye.roles.remove(roller.muteRolü).catch(x => client.logger.log("Chatmute rolü ceza tarayıcısı tarafından alınamadı.", "caution"));
            if(await Punitives.findOne({No: ceza.No})) await Punitives.updateOne({ No: ceza.No }, { $set: { "Aktif": false, Bitis: Date.now()} }, { upsert: true }).exec();
            await Mute.findByIdAndDelete(ceza._id)
          } else {
            if(uye && uye.manageable) await uye.roles.add(roller.muteRolü).catch(x => client.logger.log("Chatmute rolü ceza tarayıcısı tarafından eklenemedi.", "caution"));
          };
        };
  }
}

module.exports = { 
  VoiceMutes, 
  Mutes,
  Jails
};
