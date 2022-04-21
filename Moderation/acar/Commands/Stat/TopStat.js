const {MessageEmbed} = require("discord.js");
const Stats = require('../../../Database/Schema/Stats');
const moment = require('moment');
require('moment-duration-format');
require('moment-timezone');
module.exports = {
    Isim: "top",
    Komut: ["topmesaj","topstat","topses"],
    Kullanim: "top",
    Aciklama: "Belirlenen üye veya kullanan üye eğer ki yetkiliyse onun yetki atlama bilgilerini gösterir.",
    Kategori: "Stat",
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
     const embed = new MessageEmbed().setColor(ayarlar.embed.altbaşlık).setColor(ayarlar.embed.renk).setAuthor(ayarlar.embed.başlık, message.guild.iconURL({dynamic: true, size: 2048}))
    Stats.find({guildID: message.guild.id}).exec((err, data) => {
        data = data.filter(m => message.guild.members.cache.has(m.userID));
        let PublicListele = data.sort((uye1, uye2) => {
            let uye2Toplam = 0;
            uye2.voiceStats.forEach((x, key) => {
                if(key == kanallar.publicKategorisi) uye2Toplam += x
            });
            let uye1Toplam = 0;
            uye1.voiceStats.forEach((x, key) => {
                if(key == kanallar.publicKategorisi) uye1Toplam += x
            });
            return uye2Toplam-uye1Toplam;
        }).slice(0, 15).map((m, index) => {
            let uyeToplam = 0;
            m.voiceStats.forEach((x, key) => { if(key == kanallar.publicKategorisi) uyeToplam += x });
            return `\`${index == 0 ? `👑` : `${index+1}.`}\` ${message.guild.members.cache.get(m.userID).toString()} \`${client.sureCevir(uyeToplam)}\` ${m.userID == message.member.id ? `**(Siz)**` : ``}`;
        }).join('\n');
      
       let sesSıralaması = data.sort((uye1, uye2) => {
            let uye2Toplam2 = 0;
            uye2.voiceStats.forEach(x => uye2Toplam2 += x);
            let uye1Toplam2 = 0;
            uye1.voiceStats.forEach(x => uye1Toplam2 += x);
            return uye2Toplam2-uye1Toplam2;
        }).slice(0, 15).map((m, index) => {
            let uyeToplam2 = 0;
            m.voiceStats.forEach(x => uyeToplam2 += x);
            return `\`${index == 0 ? `👑` : `${index+1}.`}\` ${message.guild.members.cache.get(m.userID).toString()} \`${client.sureCevir(uyeToplam2)}\` ${m.userID == message.member.id ? `**(Siz)**` : ``}`;
        }).join('\n');

        let mesajSıralaması = data.sort((uye1, uye2) => {
            let uye2Toplam = 0;
            uye2.chatStats.forEach(x => uye2Toplam += x);
            let uye1Toplam = 0;
            uye1.chatStats.forEach(x => uye1Toplam += x);
            return uye2Toplam-uye1Toplam;
        }).slice(0, 10).map((m, index) => {
            let uyeToplam = 0;
            m.chatStats.forEach(x => uyeToplam += x);
            return `\`${index == 0 ? `👑` : `${index+1}.`}\` ${message.guild.members.cache.get(m.userID).toString()} \`${Number(uyeToplam)} mesaj\` ${m.userID == message.member.id ? `**(Siz)**` : ``}`;
        }).join('\n');
        embed.setDescription(`\`${message.guild.name}\` sunucusunun haftalık ses ve mesaj aktiflikleri aşağı da belirtilmiştir.`);
        embed.addField('Genel Ses Sıralaması', sesSıralaması ? sesSıralaması : "Veri Bulunamadı.",false);
        embed.addField('Genel Public Sıralaması', PublicListele ? PublicListele : "Veri Bulunamadı.",false);
        embed.addField('Genel Mesaj Sıralaması', mesajSıralaması ? mesajSıralaması : "Veri Bulunamadı.",false);

        embed.setFooter(ayarlar.embed.altbaşlık)
     
        message.channel.send(embed)
    });
  }
};