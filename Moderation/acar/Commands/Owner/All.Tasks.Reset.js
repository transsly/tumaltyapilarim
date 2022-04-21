const { Client, Message, MessageEmbed, Util} = require("discord.js");
const Stats = require('../../../Database/Schema/Stats');
const Tasks = require('../../../Database/Schema/Managements');
module.exports = {
    Isim: "görev-sıfırla",
    Komut: ["reset-tasks", "resettasks", "görevlersıfırla", "görevleritemizle", "görevsıfırla" ],
    Kullanim: "görev-sıfırla <Sunucu-ID>",
    Aciklama: "Belirtilen sunucunun tüm görev geçmişini temizler.",
    Kategori: "Stats",
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
    message.channel.send(`${message.guild.emojiGöster(emojiler.Onay)} Başarıyla \`${uyeler.size}\` adet görevi olan üyenin görevleri sıfırlandı.`)
    message.react(emojiler.Onay)
    }
};