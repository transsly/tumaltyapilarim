const { Client, Message, MessageEmbed} = require("discord.js");
const Punitives = require('../../../Database/Schema/Punitives');
const Kullanıcı = require('../../../Database/Schema/Users');
const Vmute = require('../../../Database/Schema/Voicemutes');
const ms = require('ms')

module.exports = {
    Isim: "voicemute",
    Komut: ["vmute", "sesmute"],
    Kullanim: "sesmute <@sehira/ID>",
    Aciklama: "Belirlenen üyeyi ceza şeklinde uyarır ve cezalarına işler.",
    Kategori: "Moderation",
    Extend: true,
    
   /**
   * @param {Client} client 
   */
  onLoad: function (client) {

  },

   /**
   * @param {Client} client 
   * @param {Message} message 
   * @param {Array<String>} args 
   */

  onRequest: async function (client, message, args) {
    let embed = new MessageEmbed().setAuthor(ayarlar.embed.başlık, message.guild.iconURL({dynamic: true})).setColor(ayarlar.embed.renk).setFooter(ayarlar.embed.altbaşlık)
    if(!roller.voiceMuteHammer.some(oku => message.member.roles.cache.has(oku)) && !roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.altYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku))  && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(cevaplar.noyt);
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!uye) return message.channel.send(cevaplar.üye + ` \`${sistem.prefix}${module.exports.Isim} <@sehira/ID>\``);
    if(uye.user.bot) return message.channel.send(cevaplar.bot);
    if(message.author.id === uye.id) return message.channel.send(cevaplar.kendi);
    if(!uye.manageable) return message.channel.send(cevaplar.dokunulmaz);
    if(message.member.roles.highest.position <= uye.roles.highest.position) return message.channel.send(cevaplar.yetkiust);
    let cezakontrol = await Vmute.findById(uye.id)
    if(cezakontrol) {
        message.channel.send(cevaplar.cezavar);
        message.react(emojiler.Iptal)
        return;
    }
    let sebepcek = require('../../Settings/_reasons.json').Vmute;
    let sebeplistele = await message.channel.send(embed.setDescription(`${message.guild.emojiGöster(emojiler.Susturuldu)} ${uye} isimli üyesini hangi sebep ile **ses kanallarından** susturmamı istiyorsun?\n\n${sebepcek.map((value, index) => `\`${value.emoji} ${value.sebep}\``).join("\n")}`)).then(async m => {
      await m.react(sebepcek[0].emoji)
      await m.react(sebepcek[1].emoji)
      await m.react(sebepcek[2].emoji)
      await m.react(sebepcek[3].emoji)
      await m.react(sebepcek[4].emoji)
      await m.react(sebepcek[5].emoji)
      await m.react(sebepcek[6].emoji)
      await m.react(sebepcek[7].emoji)
      return m; }).catch(err => undefined);
      let tepki = await sebeplistele.awaitReactions((reaction, user) => user.id == message.author.id, { errors: ["time"], max: 1, time: 30000 }).then(coll => coll.first()).catch(err => { message.channel.send(embed.setDescription(`${message.author}, \`30 saniye\` boyunca cevap vermediği için ceza-i işlem iptal edildi.`)).then(sil => sil.delete({timeout: 7500})); sebeplistele.delete().catch(); return; });
      if(!tepki) return;
        sebeplistele.delete()
      if (tepki.emoji.name == sebepcek[0].emoji) {
        await Cezalandır(uye, message, sebepcek[0].sebep, sebepcek[0].suresi, sebepcek[0].zaman, embed)
      }if (tepki.emoji.name == sebepcek[1].emoji) {
        await Cezalandır(uye, message, sebepcek[1].sebep, sebepcek[1].suresi, sebepcek[1].zaman, embed)
      }if (tepki.emoji.name == sebepcek[2].emoji) {
        await Cezalandır(uye, message, sebepcek[2].sebep, sebepcek[2].suresi, sebepcek[2].zaman, embed)
      }if (tepki.emoji.name == sebepcek[3].emoji) {
        await Cezalandır(uye, message, sebepcek[3].sebep, sebepcek[3].suresi, sebepcek[3].zaman, embed)
      }if (tepki.emoji.name == sebepcek[4].emoji) {
        await Cezalandır(uye, message, sebepcek[4].sebep, sebepcek[4].suresi, sebepcek[4].zaman, embed)
      }if (tepki.emoji.name == sebepcek[5].emoji) {
        await Cezalandır(uye, message, sebepcek[5].sebep, sebepcek[5].suresi, sebepcek[5].zaman, embed)
      }if (tepki.emoji.name == sebepcek[6].emoji) {
        await Cezalandır(uye, message, sebepcek[6].sebep, sebepcek[6].suresi, sebepcek[6].zaman, embed)
      }if (tepki.emoji.name == sebepcek[7].emoji) {
        await Cezalandır(uye, message, sebepcek[7].sebep, sebepcek[7].suresi, sebepcek[7].zaman, embed)
      }
    }
};

async function Cezalandır(uye, message, sebep, sure, mutezaman, embed) {
    let cezano = await Punitives.countDocuments().exec();
    cezano = cezano == 0 ? 1 : cezano + 1;
    await Punitives.find({}).exec(async (err, res) => {
        let ceza = new Punitives({ 
            No: cezano,
            Uye: uye.id,
            Yetkili: message.member.id,
            Tip: "Seste Susturulma",
            AtilanSure: mutezaman,
            Sebep: sebep,
            Kalkma: Date.now()+ms(sure),
            Tarih: Date.now()
        })
        let Zamanlama = new Vmute({
            No: ceza.No,
            _id: uye.id,
            Kalkma: Date.now()+ms(sure)
        }) 
        Zamanlama.save().catch(e => console.error(e));
        ceza.save().catch(e => console.error(e));
        await Kullanıcı.updateOne({ id: message.member.id } , { $inc: { "Kullanimlar.Sesmute": 1 } }, { upsert: true }).exec();
        message.guild.log(ceza, uye, message.author, "Seste Susturulma", "sesmute-log")
        if(uye && uye.manageable) await uye.roles.add(roller.voicemuteRolü).catch(x => client.logger.log("Voicemute rolü verilemedi lütfen Rol ID'sini kontrol et.", "caution"));;
        if(uye && uye.voice.channel) await uye.voice.kick()
        message.channel.send(`${message.guild.emojiGöster(emojiler.Susturuldu)} ${uye} isimli üyeye \`${sebep}\` nedeniyle "__Seste Susturulma__" türünde \`${mutezaman}\` boyunca ceza-i işlem uygulandı. (Ceza Numarası: \`#${ceza.No}\`)`)
        if(uye) uye.send(embed.setDescription(`${message.author} tarafından \`${sebep}\` sebebi ile **${tarihsel(Date.now())}** tarihinde \`${mutezaman}\` süresince sunucuda ses kanallarında susturuldun.`)).catch(x => {
          message.channel.send(`${cevaplar.prefix} ${uye} üyesinin özel mesajları kapalı olduğundan dolayı bilgilendirme gönderilemedi.`).then(x => x.delete({timeout: 5000}))
      })
    });
    message.react(emojiler.Onay)
}