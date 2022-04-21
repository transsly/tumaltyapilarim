const { Client, Message, MessageEmbed} = require("discord.js");
const Coins = require('../../../Database/Schema/Coins');
module.exports = {
    Isim: "coin",
    Komut: ["currently","coinlerim","para","param"],
    Kullanim: "coin <@sehira/ID>",
    Aciklama: "",
    Kategori: "Economy",
    Extend: true,
    
   /**
   * @param {Client} client 
   */
  onLoad: function (client) {

  },

   /**
   * @param {Client} client
   * @param {Message} message
   * @param {Array<String|Number>} args
   * @returns {Promise<void>}
   */

  onRequest: async function (client, message, args) {
    if(!coinConf.sistem) return;
    let embed = new MessageEmbed().setAuthor(ayarlar.embed.başlık, message.guild.iconURL({dynamic: true, size: 2048}))
    .setFooter(ayarlar.embed.altbaşlık).setColor(ayarlar.embed.renk);
    let kullanici = message.mentions.users.first() || client.users.cache.get(args[0]) || (args.length > 0 ? client.users.cache.filter(e => e.username.toLowerCase().includes(args.join(" ").toLowerCase())).first(): message.author) || message.author;
    let uye = message.guild.member(kullanici);
    let Coin = await Coins.findById(uye.id)
    message.channel.send(embed.setDescription(`${uye} üyenin güncel hesabında \`${Coin ? Coin.Coin : 0}\` ${message.guild.emojiGöster(emojiler.Görev.Para)} bulunmakta.`))
    }
};