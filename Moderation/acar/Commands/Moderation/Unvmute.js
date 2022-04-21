const { Client, Message, MessageEmbed} = require("discord.js");
const Punitives = require('../../../Database/Schema/Punitives');
const Vmute = require('../../../Database/Schema/Voicemutes');

module.exports = {
    Isim: "unvmute",
    Komut: ["unvoicemute", "unsesmute"],
    Kullanim: "unvmute <#No/@sehira/ID>",
    Aciklama: "Belirlenen üyenin ses kanallarında ki susturulmasını kaldırır.",
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
    if(Number(args[0])) {
        let cezanobul = await Vmute.findOne({No: args[0]});
        if(cezanobul) args[0] = cezanobul._id
    }
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!uye) return message.channel.send(cevaplar.üye + ` \`${sistem.prefix}${module.exports.Isim} <#No/@sehira/ID>\``);
    if(uye.user.bot) return message.channel.send(cevaplar.bot);
    if(message.author.id === uye.id) return message.channel.send(cevaplar.kendi);
    if(!uye.manageable) return message.channel.send(cevaplar.dokunulmaz);
    if(message.member.roles.highest.position <= uye.roles.highest.position) return message.channel.send(cevaplar.yetkiust);
    let cezakontrol = await Vmute.findById(uye.id)
    if(!cezakontrol) {
        message.channel.send(cevaplar.cezayok);
        message.react(emojiler.Iptal)
        return;
    };
    let cezabilgisi = await Punitives.findOne({ Uye: uye.id, Aktif: true, Tip: "Seste Susturulma" })
    if(cezabilgisi.Yetkili !== message.author.id && !message.member.hasPermission("ADMINISTRATOR") && !roller.kurucuRolleri.some(x => message.member.roles.cache.has(x))) return message.channel.send(embed.setDescription(`${cezabilgisi.Yetkili ? message.guild.members.cache.get(cezabilgisi.Yetkili) ? `${message.guild.members.cache.get(cezabilgisi.Yetkili)} (\`${cezabilgisi.Yetkili}\`)` : `${cezabilgisi.Yetkili}` :  `${cezabilgisi.Yetkili}`} tarafından cezalandırılmış, senin bu cezalandırmayı açman münkün gözükmüyor.`));
    await Punitives.updateOne({ No: cezakontrol.No }, { $set: { "Aktif": false, Bitis: Date.now(), Kaldiran: message.member.id} }, { upsert: true }).exec();
    await Vmute.findByIdAndDelete(uye.id)
    let channel = message.guild.kanalBul("sesmute-log")
    if(channel) channel.send(embed.setDescription(`${uye} uyesinin \`#${cezakontrol.No}\` numaralı ses kanallarındaki susturulması, **${tarihsel(Date.now())}** tarihinde ${message.member} tarafından kaldırıldı.`))
    if(uye && uye.manageable) await uye.roles.remove(roller.voicemuteRolü).catch(x => client.logger.log("Voicemute rolü geri alınamadı lütfen Rol ID'sini kontrol et.", "caution"));;
    if(uye && uye.voice.channel) await uye.voice.setMute(false);
    await message.channel.send(`${message.guild.emojiGöster(emojiler.SusturulmaKaldirildi)} ${uye} üyesinin (\`#${cezakontrol.No}\`) ceza numaralı ses kanallarındaki susturulması kaldırıldı!`).then(x => x.delete({timeout: 10500}));
    if(uye) uye.send(embed.setDescription(`${message.author} tarafından **${tarihsel(Date.now())}** tarihinde \`#${cezakontrol.No}\` ceza numaralı ses kanallarındaki susturulman kaldırıldı.`)).catch(x => {
        message.channel.send(`${cevaplar.prefix} ${uye} üyesinin özel mesajları kapalı olduğundan dolayı bilgilendirme gönderilemedi.`).then(x => x.delete({timeout: 5000}))
    });
    message.react(emojiler.Onay)
    }
};