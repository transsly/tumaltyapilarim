const { Client, Message, MessageEmbed, Guild } = require("discord.js");
module.exports = {
    Isim: "kilit",
    Komut: ["chatkilit", "kitle"],
    Kullanim: "kilit @sehira/ID",
    Aciklama: "Komutun kullanıldığı metin kanalına yazmayı engeller.",
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
    let embed = new MessageEmbed().setAuthor(ayarlar.embed.başlık, message.guild.iconURL({dynamic: true})).setColor(ayarlar.embed.renk).setFooter(ayarlar.embed.altbaşlık)
  if(!roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(cevaplar.noyt).then(x => x.delete({timeout: 5000}));
  let everyone = message.guild.roles.cache.find(a => a.name === "@everyone");
  let permObjesi = {};
  let everPermleri = message.channel.permissionOverwrites.get(everyone.id);
  everPermleri.allow.toArray().forEach(p => {
    permObjesi[p] = true;
  });
  everPermleri.deny.toArray().forEach(p => {
    permObjesi[p] = false;
  });
  if(message.channel.permissionsFor(everyone).has('SEND_MESSAGES')) {
    permObjesi["SEND_MESSAGES"] = false;
    message.channel.createOverwrite(everyone, permObjesi);
    message.channel.send(embed.setDescription(`${message.guild.emojiGöster(emojiler.Iptal)} \`#${message.channel.name}\`  isimli metin kanalına yazmanız kapatıldı.`))
  } else {
    permObjesi["SEND_MESSAGES"] = true;
    message.channel.createOverwrite(everyone, permObjesi);
    message.channel.send(embed.setDescription(`${message.guild.emojiGöster(emojiler.Onay)} \`#${message.channel.name}\`  isimli metin kanalına yazmanız açıldı.`))
  };

    }
};