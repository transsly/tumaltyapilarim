const { Client, MessageEmbed, Message } = require("discord.js");
module.exports = {
    Isim: "kategoritemizle",
    Komut: ["ktemizle"],
    Kullanim: "",
    Aciklama: "",
    Kategori: "-",
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
    if(!sistem.staff.find(x => x.id == message.member.id)) return;
    let kanal = message.mentions.channels.first() || message.guild.channels.cache.get(args[0])
    if(!kanal) return message.channel.send(`${cevaplar.prefix}` + " `Kanal Bulunamadı!` lütfen bir kanal belirtmelisiniz.");
    if(kanal.type !== "category") return message.channel.send(`${cevaplar.prefix}` + " `Bu Kanal Kategori Değil!` lütfen bir kategori ID giriniz.");
    message.guild.channels.cache.forEach(channel => {
        if(channel.parentID == kanal.id) channel.delete()
        })
    message.channel.send(embed.setDescription(`${message.guild.emojiGöster(emojiler.Onay)} \`${kanal.name}\` isimli kategori başarıyla temizlendi.`))
    await kanal.delete()
}
};