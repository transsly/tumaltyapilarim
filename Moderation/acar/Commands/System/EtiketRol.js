const { Client, Message} = require("discord.js");
module.exports = {
    Isim: "etiketrol",
    Komut: ["tagetiketrol"],
    Kullanim: "",
    Aciklama: "",
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
   */

  onRequest: async function (client, message, args) {
    if(!roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku))  && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(cevaplar.noyt); 
    let tag = args[0];
    let etiket = args[1]; 
    let rol = message.mentions.roles.first() || message.guild.roles.cache.get(args[2]);
    if(!tag) return message.channel.send(`${cevaplar.prefix} \`Gerekli argümanları doğru kullanın.\` __Örn:__ \`${sistem.prefix}${module.exports.Isim} <Tag> <#Etiket> <@Rol/ID>\``);
    if(!etiket) return message.channel.send(`${cevaplar.prefix} \`Gerekli argümanları doğru kullanın.\` __Örn:__ \`${sistem.prefix}${module.exports.Isim} <Tag> <#Etiket> <@Rol/ID>\``);
    if(!rol) return message.channel.send(`${cevaplar.prefix} \`Gerekli argümanları doğru kullanın.\` __Örn:__ \`${sistem.prefix}${module.exports.Isim} <Tag> <#Etiket> <@Rol/ID>\``);
    message.guild.members.cache.filter(s => s.user.discriminator === etiket || s.user.username.includes(tag) && !s.roles.cache.has(rol)).forEach(m => m.roles.add(rol))
    message.channel.send(`
Kullanıcı adında \`${tag}\` ve etiketinde \`#${etiket}\` bulunduran kullanıcılara \`${rol.name}\` adlı rol veriliyor.
`)

    }
};