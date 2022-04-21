const { Client, Message, MessageEmbed} = require("discord.js");
const Kullanici = require('../../../Database/Schema/Users')
module.exports = {
    Isim: "topteyit",
    Komut: ["Topteyit"],
    Kullanim: "topteyit",
    Aciklama: "Sunucu genelindeki teyit sıralamasını gösterir.",
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
    if(!roller.teyitciRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(cevaplar.noyt);
    const all = await Kullanici.find().sort({ Toplamteyit: "descending" });
    let teyit = all.map((value, index) => `\`${index == 0 ? `👑` : index+1}.\` ${value.id ? message.guild.members.cache.get(value.id) ? message.guild.members.cache.get(value.id) : `<@${value.id}>` : `<@${value.id}>`} toplam teyitleri \`${value.Teyitler.filter(v => v.Cinsiyet === "erkek").length + value.Teyitler.filter(v => v.Cinsiyet === "kadın").length}\` (\`${value.Teyitler.filter(v => v.Cinsiyet === "erkek").length || 0}\` erkek, \`${value.Teyitler.filter(v => v.Cinsiyet === "kadın").length || 0}\` kadın) ${value.id == message.member.id ? `**(Siz)**` : ``}`).slice(0, 20)
    message.channel.send(embed.setDescription(`${teyit.join("\n") || "Teyit verisi bulunamadı!"}`).setFooter(ayarlar.embed.altbaşlık));
    }
};
