const { Client, MessageEmbed } = require("discord.js");

module.exports = {
    Isim: "kanaltemizle",
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
    if(!sistem.staff.find(x => x.id == message.member.id)) return;
    let embed = new MessageEmbed().setAuthor(ayarlar.embed.başlık, message.guild.iconURL({dynamic: true})).setColor(ayarlar.embed.renk).setFooter(ayarlar.embed.altbaşlık)
    message.guild.channels.cache.forEach(kanal => {
        if(kanallar.loglar.some(x => x == kanal.name)) kanal.delete()
    })
    message.channel.send(embed.setDescription(`${message.guild.emojiGöster(emojiler.Onay)} \`Kanalları Toplu Temizleme!\` işlemi uygulandı en kısa sürede birden fazla log kanalları silinecektir.`))
    

    }
};