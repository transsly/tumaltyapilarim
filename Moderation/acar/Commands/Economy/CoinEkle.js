const { Client, Message, MessageEmbed} = require("discord.js");
const Coins = require('../../../Database/Schema/Coins');
const moment = require("moment");
require("moment-duration-format");
require("moment-timezone");
module.exports = {
    Isim: "coinekle",
    Komut: ["addcoin"],
    Kullanim: "günlük",
    Aciklama: "24 Saatte bir belirli bir coin ödülü alırsınız.",
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
   * @param {Array<String|Number>} args
   * @returns {Promise<void>}
   */

  onRequest: async function (client, message, args) {
    if(!sistem.staff.find(x => x.id == message.member.id)) return;
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!uye) return message.channel.send(cevaplar.üye + ` \`${sistem.prefix}${module.exports.Isim} <@sehira/ID> <Miktar>\``);
    let Miktar = parseInt(args[1]);
    if(isNaN(Miktar)) return message.channel.send(`${cevaplar.prefix} Lütfen bir miktar belirtmelisin! __Örn:__ \`${sistem.prefix}${module.exports.Isim} <@sehira/ID> <Miktar>\``);
    await Coins.updateOne({ _id: uye.id }, { $inc: { "Coin": Miktar } }, {upsert: true}).exec();
    await message.react(emojiler.Onay).then(x => message.delete({timeout: 10000}))
   }
};

