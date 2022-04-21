const { Client, Message, MessageEmbed, Guild } = require("discord.js");
module.exports = {
    Isim: "say",
    Komut: ["istatistik"],
    Kullanim: "say",
    Aciklama: "Sunucunun bütün verilerini gösterir",
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
    let embed = new MessageEmbed().setAuthor(ayarlar.embed.başlık, message.guild.iconURL({dynamic: true})).setColor(ayarlar.embed.renk)
  if(!roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.altYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.hasPermission('ADMINISTRATOR')) return;
    message.delete() 
 let boosterRolu = roller.boosterRolü
  message.channel.send(embed.setFooter(ayarlar.embed.altbaşlık).setThumbnail(ayarlar.embed.iconURL).setDescription(`**${client.emojis.cache.get(emojiler.Tag)} Sunucumuz da ${global.sayılıEmoji(message.guild.memberCount)} kişi bulunmakta.
${client.emojis.cache.get(emojiler.Tag)} Sunucumuz da ${global.sayılıEmoji(message.guild.members.cache.filter(u => u.presence.status != "offline").size)} aktif kişi bulunmakta.
${ayarlar.etiket ? `${client.emojis.cache.get(emojiler.Tag)} Sunucumuz da ${global.sayılıEmoji(message.guild.members.cache.filter(u => u.user.username.includes(ayarlar.tag) || u.user.discriminator.includes(ayarlar.etiketTag)).size)} etiket ve taglı kişi bulunmakta.` : `${client.emojis.cache.get(emojiler.Tag)} Sunucumuz da ${global.sayılıEmoji(message.guild.members.cache.filter(u => u.user.username.includes(ayarlar.tag)).size)} taglı üye bulunmakta.`}
${client.emojis.cache.get(emojiler.Tag)} Sunucumuzu boostlayan ${global.sayılıEmoji(message.guild.roles.cache.get(boosterRolu).members.size)} (\`${message.guild.premiumTier}.Lvl\`) kişi bulunmakta.
${client.emojis.cache.get(emojiler.Tag)} Ses kanallarında ${global.sayılıEmoji(message.guild.channels.cache.filter(channel => channel.type == "voice").map(channel => channel.members.size).reduce((a, b) => a + b))} (\`+${message.guild.members.cache.filter(x => x.user.bot && x.voice.channel).size} Bot\`) kişi bulunmakta.**`)).then(x => x.delete({timeout:10000})); 
    }
};