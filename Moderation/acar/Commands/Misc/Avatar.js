const { Client, Message, MessageEmbed} = require("discord.js");
module.exports = {
    Isim: "avatar",
    Komut: ["av", "pp"],
    Kullanim: "avatar <@sehira/ID>",
    Aciklama: "Belirtilen üyenin profil resmini büyültür.",
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
    let victim = message.mentions.users.first() || client.users.cache.get(args[0]) || (args.length > 0 ? client.users.cache.filter(e => e.username.toLowerCase().includes(args.join(" ").toLowerCase())).first(): message.author) || message.author;
    let avatar = victim.avatarURL({ dynamic: true, size: 2048 });
    embed.setColor(ayarlar.embed.renk)
        .setAuthor(victim.tag, avatar)
        .setFooter(`${message.member.displayName} tarafından istendi!`, message.author.avatarURL({ dynamic: true }))
	    .setDescription(`[Resim Adresi](${avatar})`)
	    .setImage(avatar)
    message.channel.send(embed);
    }
};