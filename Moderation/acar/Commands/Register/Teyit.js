const { Client, Message, MessageEmbed} = require("discord.js");
const Kullanici = require('../../../Database/Schema/Users')
module.exports = {
    Isim: "teyit",
    Komut: ["Teyit"],
    Kullanim: "teyit <@sehira/ID>",
    Aciklama: "Belirtilen üye ve komutu kullanan üyenin teyit bilgilerini gösterir.",
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
    let embed = new MessageEmbed().setAuthor(ayarlar.embed.başlık, message.guild.iconURL({dynamic: true})).setColor(ayarlar.embed.renk)
    let kullanıcı = message.mentions.users.first() || message.guild.members.cache.get(args[0]) || (args.length > 0 ? client.users.cache.filter(e => e.username.toLowerCase().includes(args.join(" ").toLowerCase())).first(): message.author) || message.author;
    let uye = message.guild.member(kullanıcı);
    if (!uye) return message.channel.send(cevaplar.üyeyok);
    if(!roller.teyitciRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(cevaplar.noyt);
    let teyit = await Kullanici.findOne({ id: uye.id }) || [];
    let teyitBilgisi;
    if(teyit.Teyitler){
      let erkekTeyit = teyit.Teyitler.filter(v => v.Cinsiyet === "erkek").length
      let kizTeyit = teyit.Teyitler.filter(v => v.Cinsiyet === "kadın").length
      teyitBilgisi = `${uye} toplam **${erkekTeyit+kizTeyit}** kayıt yapmış! (**${erkekTeyit}** erkek, **${kizTeyit}** kadın)\n`;
    } else { 
      teyitBilgisi = `${uye} isimli kişinin teyit bilgisi bulunamadı.`
    }
    message.channel.send(embed.setDescription(`${teyitBilgisi}`).setFooter(ayarlar.embed.altbaşlık));
    }
};