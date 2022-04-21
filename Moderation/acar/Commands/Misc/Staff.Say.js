const { Client, Message, MessageEmbed} = require("discord.js");
module.exports = {
    Isim: "yetkilisay",
    Komut: ["yetkilis-say"],
    Kullanim: "yetkilisay",
    Aciklama: "Seste olmayan yetkilileri belirtir.",
    Kategori: "Yönetim",
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
    if(!sistem.staff.find(x => x.id == message.member.id) && !message.member.hasPermission('ADMINISTRATOR') && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku))) return message.channel.send(cevaplar.noyt);

    let roles = message.guild.roles.cache.get(roller.MinYetkili);
    let üyeler = message.guild.members.cache.filter(uye => !uye.user.bot && !uye.hasPermission(8) && !uye.roles.cache.has(roller.kurucuRolleri) && uye.roles.highest.position >= roles.position && uye.presence.status !== "offline" && !uye.voice.channel).array();
    var filter = m => m.author.id === message.author.id && m.author.id !== client.user.id && !m.author.bot;
    if(üyeler.length == 0) return
    message.channel.send(`Online olup seste olmayan <@&${roles.id}> rolündeki ve üzerinde ki yetkili sayısı: ${üyeler.length ? üyeler.length : 0} `)
       message.channel.send(``+ üyeler.map(x => "<@" + x.id + ">").join(",") + ``)
    }
};