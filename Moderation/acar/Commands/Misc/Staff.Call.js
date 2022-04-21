const { Client, Message, MessageEmbed} = require("discord.js");
module.exports = {
    Isim: "yetkili-mesaj",
    Komut: ["seseçağır", "yetkiliçağır", "yetkili-çağır","sesçağır", "ytçağır"],
    Kullanim: "yetkiliçağır",
    Aciklama: "Seste olmayan yetkilileri çağırır.",
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
    let embed = new MessageEmbed().setAuthor(ayarlar.embed.başlık, message.guild.iconURL({dynamic: true})).setColor(ayarlar.embed.renk)
    let enAltYetkiliRolü = message.guild.roles.cache.get(roller.MinYetkili);
    let yetkililer = message.guild.members.cache.filter(uye => !uye.user.bot && !uye.hasPermission(8) && !uye.roles.cache.has(roller.kurucuRolleri) && uye.roles.highest.position >= enAltYetkiliRolü.position && uye.presence.status !== "offline" && !uye.voice.channel).array();
    if (yetkililer.length == 0) return message.reply('Aktif olup, seste olmayan yetkili bulunmuyor. Maşallah!');
    let mesaj = await message.channel.send(`**${yetkililer.length}** yetkiliye sese gelme çağırısı yapılıyor`);
    var filter = m => m.author.id === message.author.id && m.author.id !== client.user.id && !m.author.bot;
        yetkililer.forEach((yetkili, index) => {
          setTimeout(() => {
            yetkili.send(message.guild.name+' Sunucusunda yetkin var ancak seste değilsin. Eğer sese girmez isen yetki yükseltimin göz önünde bulundurulacaktır.').then(x => mesaj.edit(embed.setDescription(`${yetkili} yetkilisine özelden mesaj atıldı!`).setColor(message.member.displayHexColor))).catch(err => message.channel.send(`${yetkili}, Sunucusunda yetkin var ancak seste değilsin. Eğer sese girmez isen yetki yükseltimin göz önünde bulundurulacaktır. Ayrıca dm'ni aç mesaj atamıyorum.`).then(x => mesaj.edit(embed.setDescription(`${yetkili} yetkilisine özelden mesaj atılamadığı için kanalda etiketlendi!`).setColor(message.member.displayHexColor))));
          }, index*1000);
        });
    }
};