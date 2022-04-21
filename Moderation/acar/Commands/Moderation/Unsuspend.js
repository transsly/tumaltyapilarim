const { Client, Message, MessageEmbed} = require("discord.js");
const Punitives = require('../../../Database/Schema/Punitives');
const Jail = require('../../../Database/Schema/Jails');
const Users = require('../../../Database/Schema/Users');
module.exports = {
    Isim: "şüpheliçıkart",
    Komut: ["unsuspend", "unsuspect"],
    Kullanim: "şüpheliçıkart <@sehira/ID> <Sebep>",
    Aciklama: "Belirtilen üye yeni bir hesapsa onu şüpheliden çıkartır.",
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
    if(!roller.jailHammer.some(oku => message.member.roles.cache.has(oku)) && !roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.altYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku))  && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(cevaplar.noyt);
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!uye) return message.channel.send(cevaplar.üye + ` \`${sistem.prefix}${module.exports.Isim} <@sehira/ID>\``);
    if(uye.user.bot) return message.channel.send(cevaplar.bot);
    if(message.author.id === uye.id) return message.channel.send(cevaplar.kendi);
    if(!uye.manageable) return message.channel.send(cevaplar.dokunulmaz);
    if(message.member.roles.highest.position <= uye.roles.highest.position) return message.channel.send(cevaplar.yetkiust);
    let cezakontrol = await Jail.findById(uye.id)
    if(cezakontrol) {
        message.channel.send(`${cevaplar.prefix} Belirtilen üye sistemsel tarafından cezalandırılmış, şüpheli çıkart komutu ile çıkartman münkün gözükmüyor.`).then(x => x.delete({timeout: 7500}));
        message.react(emojiler.Iptal)
        return;
    };
    if(uye && uye.manageable) {
        let CID = await Users.findOne({ id: uye.id }) || [];
        if(CID) { if(CID.Cinsiyet || CID.Isim || CID.Yas) {
          if(uye && uye.manageable) await uye.setNickname(`${uye.user.username.includes(ayarlar.tag) ? ayarlar.tag : (ayarlar.tagsiz ? ayarlar.tagsiz : (ayarlar.tag || ""))} ${CID.Isim} | ${CID.Yas}`)
          if(!ayarlar.taglıalım) {
            if(CID.Cinsiyet == "erkek") await uye.rolTanımla(roller.erkekRolleri)
            if(CID.Cinsiyet == "kadın") await uye.rolTanımla(roller.kadınRolleri)
            if(uye && uye.manageable && uye.user.username.includes(ayarlar.tag)) await uye.roles.add(roller.tagRolü)
          } else {
            if(uye && uye.manageable) await uye.rolTanımla(roller.kayıtsızRolleri).catch(x => client.logger.log("Şüpheli komutunda kayıtsız rolü verilemedi oraya bi göz atmanı öneririm.", "caution"));
          }
        }}
          if(!CID || !CID.Cinsiyet || !CID.Isim || !CID.Yas) await uye.rolTanımla(roller.kayıtsızRolleri).catch(x => client.logger.log("Şüpheli komutunda kayıtsız rolü verilemedi oraya bi göz atmanı öneririm.", "caution"));
          if(!CID || !CID.Isim || !CID.Yas) await uye.setNickname(`${uye.user.username.includes(ayarlar.tag) ? ayarlar.tag : (ayarlar.tagsiz ? ayarlar.tagsiz : (ayarlar.tag || ""))} İsim | Yaş`) 
    }
    await message.channel.send(`${message.guild.emojiGöster(emojiler.Onay)} ${uye} üyesi şüpheli hesap konumundan çıkartıldı!`).then(x => x.delete({timeout: 10500}));
    if(uye) uye.send(embed.setDescription(`${message.author} tarafından **${tarihsel(Date.now())}** tarihinde şüpheliden çıkartıldın!`)).catch(x => {
      message.channel.send(`${cevaplar.prefix} ${uye} üyesinin özel mesajları kapalı olduğundan dolayı bilgilendirme gönderilemedi.`).then(x => x.delete({timeout: 5000}))
    });
    message.react(emojiler.Onay)
    }
};