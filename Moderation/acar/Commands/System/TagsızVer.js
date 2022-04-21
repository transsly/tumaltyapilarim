const { Client, Message, MessageEmbed} = require("discord.js");

module.exports = {
    Isim: "tagsızver",
    Komut: ["tagsızlarver"],
    Kullanim: "tagsızver # tagı olup taglı rolü olmayan üyelere taglı rolü verir.",
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
    let embed = new MessageEmbed().setAuthor(ayarlar.embed.başlık, message.guild.iconURL({dynamic: true})).setColor(ayarlar.embed.renk)
    if(!roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(cevaplar.noyt)

    let rolsuzuye = message.guild.members.cache.filter(m => m.user.username.includes(ayarlar.tag) && !m.roles.cache.has(roller.tagRolü) && !m.roles.cache.has(roller.şüpheliRolü) && !m.roles.cache.has(roller.yasaklıTagRolü) &&  !m.roles.cache.has(roller.jailRolü) && !roller.kayıtsızRolleri.some(x => m.roles.cache.has(x)))
    rolsuzuye.forEach(roluolmayanlar => { 
      roluolmayanlar.roles.add(roller.tagRolü)
      roluolmayanlar.setNickname(roluolmayanlar.displayName.replace(ayarlar.tagsiz, ayarlar.tag))
    });
    let rollütagsiz = message.guild.members.cache.filter(m => !m.user.username.includes(ayarlar.tag) && m.roles.cache.has(roller.tagRolü) && !m.roles.cache.has(roller.şüpheliRolü) && !m.roles.cache.has(roller.yasaklıTagRolü) &&  !m.roles.cache.has(roller.jailRolü) && !roller.kayıtsızRolleri.some(x => m.roles.cache.has(x)))
        rollütagsiz.forEach(rl => {
        rl.setNickname(rl.displayName.replace(ayarlar.tag, ayarlar.tagsiz))
        rl.roles.remove(roller.tagRolü)
    });
    message.channel.send(embed.setDescription(`Sunucuda taglı olup rolü olmayan \`${rolsuzuye.size}\` kişiye taglı rolü verildi, ve tagsız \`${rollütagsiz.size}\` kişiden geri alındı!`).setFooter(ayarlar.embed.altbaşlık)).then(x => x.delete({timeout: 8000}));
    message.react(emojiler.Onay)
    }
};