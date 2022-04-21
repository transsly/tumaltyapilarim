const { Client, Message, MessageEmbed} = require("discord.js");
module.exports = {
    Isim: "banner-oluştur",
    Komut: ["arkaplan-oluştur","banneroluştur", "arkap-oluştur", "bannercreate", "create-banner", "banner-create" ],
    Kullanim: "banner-oluştur <Yazı>",
    Aciklama: "Belirtilen yazıda bir banner oluşturur.",
    Kategori: "Misc",
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
    let yazi = args.slice(0).join(' ');
    if(!yazi) return message.channel.send('Lütfen bir yazı belirtin.');
     const bannerurl = `https://flamingtext.com/net-fu/proxy_form.cgi?imageoutput=true&script=uprise-logo&text=${yazi}`
  .replace(' ', '+')
    embed.setDescription(`[Oluşturulan Arkaplan İçin TIKLA](${bannerurl})`)
	    .setImage(bannerurl)
    message.channel.send(embed);
    }
};