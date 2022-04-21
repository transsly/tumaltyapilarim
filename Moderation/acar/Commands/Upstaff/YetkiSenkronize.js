const { MessageEmbed } = require("discord.js");
const Stats = require('../../../Database/Schema/Stats');
const InviteData = require('../../../Database/Schema/Invites');
const Users = require('../../../Database/Schema/Users');
const Upstaffs = require('../../../Database/Schema/Upstaffs');

const moment = require('moment');
require('moment-duration-format');
require('moment-timezone');

module.exports = {
    Isim: "ysenk",
    Komut: ["yetkisenkronize","y"],
    Kullanim: "y u <@sehira/ID> <Yetki S.Kodu>",
    Aciklama: "Belirlenen üyeyi terfi sistemine senkronize eder.",
    Kategori: "-",
    Extend: true,
    
   /**
   * @param {Client} client 
   */
  onLoad: function (client) {
    client.sureCevir = (date) => { return moment.duration(date).format('H [saat,] m [dakika,] s [saniye]'); };
  },

   /**
   * @param {Client} client 
   * @param {Message} message 
   * @param {Array<String>} args 
   */

  onRequest: async function (client, message, args) {
    let embed = new MessageEmbed().setAuthor(ayarlar.embed.başlık, message.guild.iconURL({dynamic: true})).setColor(ayarlar.embed.renk).setFooter(ayarlar.embed.altbaşlık)
    if(!uPConf.sistem) return; 
    let işlem = args[0]
    if(işlem !== "u" && işlem !== "r") return;
    if(işlem === "u") {
    let kullArray = message.content.split(" ");
    let kullArgs = kullArray.slice(1);
    let uye = message.mentions.members.first() || message.guild.members.cache.get(kullArgs[1]) || message.guild.members.cache.find(x => x.user.username.toLowerCase() === kullArgs.slice(1).join(" ") || x.user.username === kullArgs[1])
    if(!sistem.staff.find(x => x.id == message.member.id)) return;
    if(!uye) return message.channel.send(cevaplar.üye + ` \`${sistem.prefix}${module.exports.Isim} u <@sehira/ID> <Yetki Numarası>\``).then(x => x.delete({timeout: 5000}));
    if(!uye.user.username.includes(ayarlar.tag)) return message.channel.send(`${cevaplar.prefix} Belirtilen üyenin isminde \`${ayarlar.tag}\` bulunmadığından dolayı yetkisi sisteme senkronize yapılamıyor.`).then(x => x.delete({timeout: 7500}));
    if(message.author.id === uye.id) return message.channel.send(cevaplar.kendi).then(x => x.delete({timeout: 5000}));
    let yetkiKodu = parseInt(args[2]);
    if(isNaN(yetkiKodu)) return message.channel.send(cevaplar.argümandoldur + ` \`${sistem.prefix}${module.exports.Isim} <@sehira/ID> <Yetki Numarası>\``);
    if(yetkiKodu > uPConf.yetkipuan.length) return message.channel.send('${cevaplar.prefix} Lütfen geçerli bir yetki kodu girin aksi taktirde senkron işlemini yapamazsınız.');
    await Upstaffs.updateOne({ _id: uye.id }, { $set: { "staffNo": yetkiKodu, "staffExNo": yetkiKodu - 1, "Points": 0, "ToplamPuan": 0, "Baslama": Date.now() } }, {upsert: true}); 
    let yeniYetki = uPConf.yetkipuan.filter(x => x.No == yetkiKodu - 1);
    if(yeniYetki) yeniYetki = yeniYetki[yeniYetki.length-1];
    if(yeniYetki) {
        if(!uye.roles.cache.has(yeniYetki.rol)) uye.roles.add(yeniYetki.rol)
        if(!roller.abilityHammer.some(x => uye.roles.cache.has(x))) await uye.roles.add(roller.abilityHammer);
    }
    message.react(emojiler.Onay)
    message.guild.kanalBul("senk-log").send(embed.setDescription(`${message.member} isimli yetkili ${uye} isimli üyeyi **${tarihsel(Date.now())}** tarihinde ${yeniYetki.rol ? message.guild.roles.cache.get(yeniYetki.rol) : "Bulunamadı!"} role senkronize etti.`))
    } else if(işlem === "r") {
      if(!sistem.staff.find(x => x.id == message.member.id)) return;
      const rol = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
      if(!rol) return message.channel.send(`Hata: Lütfen bir rol giriniz! __Örn:__ \`${sistem.prefix}${module.exports.Isim} r <@rol/ID>\``);
      if(rol.members.size === 0) return message.channel.send(`Hata: \`Belirtilen rolde üye bulunamadı ve işlem iptal edildi!\``);
        rol.members.forEach(async uye => {
          if (uye.user.bot) return;
            if (uPConf.yetkipuan.some(x => uye.roles.cache.has(x.rol))) {
              let acar = uPConf.yetkipuan.find(x => uye.roles.cache.has(x.rol))
	      let No = Number(acar.No)
              if(!roller.abilityHammer.some(x => uye.roles.cache.has(x))) await uye.roles.add(roller.abilityHammer);
              await Upstaffs.updateOne({ _id: uye.id }, { $set: { "staffNo": No + Number(1), "staffExNo": No, "Points": 0, "ToplamPuan": 0, "Baslama": Date.now() } }, {upsert: true}); 
              //message.channel.send(`${message.guild.emojiGöster(emojiler.Onay)} ${uye} kişisi \`${rol.name}\` yetkisine senkronize edildi.`);
            } else return message.channel.send(`Hata: \`Belirtilen rolde terfi sistemine bağlı hiçbir üye bulunamadı!\``);
        
        });
        message.react(emojiler.Onay);
        //message.guild.kanalBul("senk-log").send(embed.setDescription(`${message.member} isimli yetkili ${rol} isimli roldeki üyeleri senkronize etti.`));
    }
  }
};