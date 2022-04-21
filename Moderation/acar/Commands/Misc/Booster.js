const { Client, Message, MessageEmbed } = require("discord.js");
module.exports = {
    Isim: "booster",
    Komut: ["b","boost","zengin"],
    Kullanim: "booster <Belirlenen Isim>",
    Aciklama: "Sunucuya takviye atan üyeler bu komut ile isim değişimi yapar.",
    Kategori: "Misc",
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
  onRequest: async (client, message, args) => {
    let embed = new MessageEmbed().setAuthor(ayarlar.embed.başlık, message.guild.iconURL({dynamic: true})).setColor(ayarlar.embed.renk)
      if (!message.member.roles.cache.has(roller.boosterRolü) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(cevaplar.noyt).then(x => x.delete({ timeout: 5000 }));
     // if(roller.Yetkiler.some(x => message.member.roles.cache.has(x)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(cevaplar.noyt).then(x => x.delete({ timeout: 5000 }));
      let uye = message.guild.member(message.author);
      let yazilacakIsim;
      let isim = args.join(' ');
      if (!isim) return message.channel.send(`${cevaplar.prefix} Lütfen bir isim belirleyiniz!  __Örn:__  \`${sistem.prefix}booster <Belirlenen Isim> Max: 32 Karakter!\``).then(x => x.delete({ timeout: 5000 }));
      yazilacakIsim = `${uye.user.username.includes(ayarlar.tag) ? ayarlar.tag : (ayarlar.tagsiz ? ayarlar.tagsiz : (ayarlar.tag || ""))} ${isim}`;
      if(uye.manageable) {
      uye.setNickname(`${yazilacakIsim}`).then(devam => {
      message.channel.send(embed.setDescription(`${message.guild.emojiGöster(emojiler.Tag)} Yeni İsim: \`${yazilacakIsim}\`\n${message.guild.emojiGöster(emojiler.Onay)} Başarıyla isminizi değiştirdiniz!\nYeni isminizle havanıza hava katın!`)).catch();
      message.react(emojiler.Onay)
      }).catch(acar => message.channel.send(cevaplar.isimapi))
    } else {
      message.channel.send(cevaplar.dokunulmaz).then(x => x.delete({timeout: 5000}));
    }
  }
};