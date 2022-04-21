const { Client, Message, MessageEmbed } = require("discord.js");
const Users = require('../../../Database/Schema/Users');
module.exports = {
    Isim: "toptaglı",
    Komut: ["toptaglılar"],
    Kullanim: "toptaglı",
    Aciklama: "",
    Kategori: "Register",
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
    if(!roller.teyitciRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.Yetkiler.some(oku => message.member.roles.cache.has(oku)) && !roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.altYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.Yetkiler.some(oku => message.member.roles.cache.has(oku)) && !roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(cevaplar.noyt);
    Users.find().exec((err, data) => {
      data = data.filter(m => message.guild.members.cache.has(m.id));
      let topTagli = data.filter(x => x.Taglılar).sort((uye1, uye2) => {
        let uye2Toplam2 = 0;
        uye2Toplam2 = uye2.Taglılar.length
        let uye1Toplam2 = 0;
        uye1Toplam2 = uye1.Taglılar.length
        return uye2Toplam2-uye1Toplam2;
    }).slice(0, 20).map((m, index) => {
        let uyeToplam2 = 0;
        uyeToplam2 = m.Taglılar.length
        return `\`${index == 0 ? `👑` : `${index+1}.`}\` ${message.guild.members.cache.get(m.id).toString()} toplam taglıları \`${uyeToplam2} üye\` ${m.id == message.member.id ? `**(Siz)**` : ``}`;
    }).join('\n');
    message.channel.send(embed.setDescription(`${topTagli ? `${topTagli}` : `\`${message.guild.name}\` sunucusun da taglı bilgileri bulunamadı.`}`))
    })
  }
};