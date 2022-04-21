const { Client, Message, MessageEmbed, Util} = require("discord.js");
const Stats = require('../../../Database/Schema/Stats');
const Tasks = require('../../../Database/Schema/Managements');
module.exports = {
    Isim: "puan-sıfırla",
    Komut: ["reset-points", "resetpoints", "puanlarsıfırla", "puanlartemizle", "puansıfırla" ],
    Kullanim: "puan-sıfırla <Sunucu-ID>",
    Aciklama: "Belirtilen sunucunun tüm puanlarını temizler.",
    Kategori: "Yönetim Sistemi",
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
    if(!sistem.staff.find(x => x.id == message.member.id)) return message.channel.send(cevaplar.noyt);
    let uyeler = message.guild.members.cache.filter(x => taskConf.yetkiler.some(r => x.roles.cache.has(r)))
    uyeler.forEach(async (x) => {
      await Stats.updateOne({ userID: x.id }, { taskVoiceStats: new Map()});
      await Tasks.findByIdAndDelete(x.id);
    })
    message.channel.send(`${message.guild.emojiGöster(emojiler.Onay)} Başarıyla \`${uyeler.size}\` adet yönetim yetkilisi olan üyelerin puanları sıfırlandı.`)
    message.react(emojiler.Onay)
    }
};