const { Client, Message, MessageEmbed, Guild } = require("discord.js");

module.exports = {
    Isim: "yoklama",
    Komut: ["yokla"],
    Kullanim: "etkinlik <yt-pn-bio-fio>",
    Aciklama: "Seste etkinlik yapmanızı sağlar.",
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
   * @param {Guild} guild
   */
  onRequest: async function (client, message, args, guild) {
 let embed = new MessageEmbed().setAuthor(ayarlar.embed.başlık, message.guild.iconURL({dynamic: true})).setColor(ayarlar.embed.renk).setFooter(ayarlar.embed.altbaşlık)
  if(!message.member.hasPermission('ADMINISTRATOR') && !roller.kurucuRoleri.some(oku => message.member.roles.cache.has(oku))) return message.channel.send(cevaplar.noyt).then(x => x.delete({timeout: 5000}));
  if(!message.member.voice || message.member.voice.channelID != kanallar.toplantıKanalı) return;
  
  let members = message.guild.members.cache.filter(member => member.roles.cache.has(roller.Katıldı) && member.voice.channelID != kanallar.toplantıKanalı);
  members.array().forEach((member, index) => {
    setTimeout(() => {
      member.roles.remove(roller.Katıldı).catch();
    }, index * 1250)
  });
  let verildi = message.member.voice.channel.members.filter(member => !member.roles.cache.has(roller.Katıldı) && !member.user.bot)
  verildi.array().forEach((member, index) => {
    setTimeout(() => {
      member.roles.add(roller.Katıldı).catch();
    }, index * 1000)
  });
  message.channel.send(embed.setDescription(`Katıldı rolü dağıtılmaya başlandı! \`${verildi.size}\` kişiye verilecek.\nKatıldı rolü alınmaya başladı! \`${members.size}\` kişiden alınacak.\n__NOT:__ Bu işlem biraz uzun sürebilir.`)).catch();
    }
};