const { Client, Message, MessageEmbed, Guild } = require("discord.js");
module.exports = {
    Isim: "sesli",
    Komut: ["ses"],
    Kullanim: "sesli",
    Aciklama: "Sunucunun seste olan üyelerinin sayısını gösterir.",
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
   * @param {Guild} guild
   */
  onRequest: async function (client, message, args, guild) {
    message.delete()
  if(!roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) &&  !roller.altYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) &&  !roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku))  && !message.member.hasPermission('ADMINISTRATOR')) return;
  let pub = message.guild.channels.cache.filter(x => x.parentID == kanallar.publicKategorisi && x.type == "voice").map(u => u.members.size).reduce((a, b) => a + b)
  let ses = message.guild.members.cache.filter(x => x.voice.channel).size
  let taglı = message.guild.members.cache.filter(x => { return x.user.username.includes(ayarlar.tag) && x.voice.channel && x.roles.cache.has(roller.tagRolü)}).size
 let tagsız = message.guild.members.cache.filter(x => { return !x.user.username.includes(ayarlar.tag) && x.voice.channel}).size
 let yetkili = message.guild.members.cache.filter(x => { return x.user.username.includes(ayarlar.tag) && x.voice.channel && roller.Yetkiler.some(yetkili => x.roles.cache.has(yetkili))}).size
 let kontrol;
   if(args[0] == "tüm") {
      kontrol = `\n${client.emojis.cache.get(emojiler.Tag)} Public kanallarında ${global.sayılıEmoji(pub)} kişi bulunmakta.
${client.emojis.cache.get(emojiler.Tag)} Ses kanallarında tagsız ${global.sayılıEmoji(tagsız)} kişi bulunmakta.
${client.emojis.cache.get(emojiler.Tag)} Ses kanallarında taglı ${global.sayılıEmoji(taglı)} kişi bulunmakta.
${client.emojis.cache.get(emojiler.Tag)} Ses kanallarında yetkili ${global.sayılıEmoji(yetkili)} kişi bulunmakta.`
   } else {
       kontrol = ``;
   }
  message.channel.send(`${client.emojis.cache.get(emojiler.Tag)} **Ses kanallarında ${global.sayılıEmoji(ses)} kişi bulunmakta.${kontrol}**`).then(x => x.delete({timeout:15000})); 
 }
};