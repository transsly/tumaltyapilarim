const { Client, Message, MessageEmbed} = require("discord.js");
const Kullanici = require('../../../Database/Schema/Users')
module.exports = {
    Isim: "isimler",
    Komut: ["isimsorgu"],
    Kullanim: "isimler <@sehira/ID>",
    Aciklama: "Belirlenen üyenin önceki isim ve yaşlarını gösterir.",
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
    if(!roller.teyitciRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.altYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(cevaplar.noyt)
    let kullanıcı = message.mentions.users.first() || message.guild.members.cache.get(args[0]) || (args.length > 0 ? client.users.cache.filter(e => e.username.toLowerCase().includes(args.join(" ").toLowerCase())).first(): message.author) || message.author;
    let uye = message.guild.member(kullanıcı);
    if (!uye) return message.channel.send(cevaplar.üyeyok);
    let isimveri = await Kullanici.findOne({ id: uye.id }) || [];
    if(isimveri.Isimler) {
    let isimler = isimveri.Isimler.length > 0 ? isimveri.Isimler.reverse().map((value, index) => `\`${ayarlar.tag} ${value.Isim} | ${value.Yas}\` (${value.islembilgi}) ${value.Yetkili ? "(<@"+ value.Yetkili + ">)" : ""}`).join("\n") : "";
	message.channel.send(embed.setDescription(`${uye} üyesinin toplamda **${isimveri.Isimler.length || 0}** isim kayıtı bulundu.\n${isimler}`).setFooter(ayarlar.embed.altbaşlık));
    } else {
         message.channel.send(embed.setDescription(`${uye} üyesinin isim kayıtı bulunamadı.`).setFooter(ayarlar.embed.altbaşlık));
     }
    }
};