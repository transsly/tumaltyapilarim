const { Client, Message, MessageEmbed } = require("discord.js");
const Users = require('../../../Database/Schema/Users');
module.exports = {
    Isim: "yetkililerim",
    Komut: ["yetkililerim","yetkilibilgisi"],
    Kullanim: "yetkililerim <@sehira/ID>",
    Aciklama: "Belirlenen veya komutu kullanan kişi belirlediği yetkili sayısını ve en son belirlediği yetkili sayısını gösterir.",
    Kategori: "Stat",
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
    let embed = new MessageEmbed().setAuthor(ayarlar.embed.başlık, message.guild.iconURL({dynamic: true})).setColor(ayarlar.embed.renk).setFooter(ayarlar.embed.altbaşlık)
    if(!roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.altYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(cevaplar.noyt);
    let kullanıcı = message.mentions.users.first() || message.guild.members.cache.get(args[0]) || await client.getUser(args[0]) || (args.length > 0 ? client.users.cache.filter(e => e.username.toLowerCase().includes(args.join(" ").toLowerCase())).first(): message.author) || message.author;
    let uye = message.guild.member(kullanıcı);
    if (!uye) return message.channel.send(cevaplar.üyeyok);
    let currentPage = 1;
    Users.findOne({id: uye.id}, async (err, res) => {
      if (!res) return message.channel.send(`${cevaplar.prefix} \`Belirtilen üyenin yetkili bilgisi bulunamadı.\``).then(x => x.delete({timeout: 7500}));
      if(!res.Yetkililer) return message.channel.send(`${cevaplar.prefix} \`Belirtilen üyenin yetkili bilgisi bulunamadı.\``).then(x => x.delete({timeout: 7500}));
      let pages = res.Yetkililer.sort((a, b) => b.Tarih - a.Tarih).chunk(20);
      if (!pages.length || !pages[currentPage - 1].length) return message.channel.send(`${cevaplar.prefix} \`Belirtilen üyenin yetkili bilgisi bulunamadı.\``).then(x => x.delete({timeout: 7500}));
      let msg = await message.channel.send(embed.setDescription(`${message.guild.emojiGöster(emojiler.Tag)} ${uye} üyesinin yetkili bilgisi yükleniyor... Lütfen bekleyin.`));
      let reactions = ["◀", "❌", "▶"];
      for (let reaction of reactions) await msg.react(reaction);
          if (msg) await msg.edit(embed.setDescription(`${uye} isimli üyenin toplam da \`${res.Yetkililer.length || 0}\` adet yetkilisi mevcut.

${pages[currentPage - 1].map((value) => `\`${message.guild.members.cache.get(value.id) ? message.guild.members.cache.get(value.id).user.username.includes(ayarlar.tag) == true ? "✅" : "❌" : "❌" }\` ${message.guild.members.cache.get(value.id) ? message.guild.members.cache.get(value.id) : '**Bilinmeyen Üye**'} kişisi \`${tarihsel(value.Tarih)}\` tarihinde yetkili olarak belirledi.`).join("\n")}`))

      const back = msg.createReactionCollector((reaction, user) => reaction.emoji.name == "◀" && user.id == message.author.id,
      { time: 20000 }),
    x = msg.createReactionCollector((reaction, user) => reaction.emoji.name == "❌" && user.id == message.author.id, 
      { time: 20000 }),
    go = msg.createReactionCollector((reaction, user) => reaction.emoji.name == "▶" && user.id == message.author.id,
      { time: 20000 });
  back.on("collect", async reaction => {
    await reaction.users.remove(message.author.id).catch(err => {});
    if (currentPage == 1) return;
    currentPage--;
    if (msg) msg.edit(embed.setDescription(`${pages[currentPage - 1].map((value) => `\`${message.guild.members.cache.get(value.id) ? message.guild.members.cache.get(value.id).user.username.includes(ayarlar.tag) == true ? "✅" : "❌" : "❌" }\` ${message.guild.members.cache.get(value.id) ? message.guild.members.cache.get(value.id) : '**Bilinmeyen Üye**'} kişisi \`${tarihsel(value.Tarih)}\` tarihinde yetkili olarak belirledi.`).join("\n")}`))
  });
  go.on("collect", async reaction => {
    await reaction.users.remove(message.author.id).catch(err => {});
    if (currentPage == pages.length) return;
    currentPage++;
    if (msg) msg.edit(embed.setDescription(`${pages[currentPage - 1].map((value) => `\`${message.guild.members.cache.get(value.id) ? message.guild.members.cache.get(value.id).user.username.includes(ayarlar.tag) == true ? "✅" : "❌" : "❌" }\` ${message.guild.members.cache.get(value.id) ? message.guild.members.cache.get(value.id) : '**Bilinmeyen Üye**'} kişisi \`${tarihsel(value.Tarih)}\` tarihinde yetkili olarak belirledi.`).join("\n")}`))
  });
  x.on("collect", async reaction => {
    await back.stop();
    await go.stop();
    await x.stop();
    if (message) message.delete().catch(err => {});
    if (msg) return msg.delete().catch(err => {});
  });
  back.on("end", async () => {
    await back.stop();
    await go.stop();
    await x.stop();
    if (message) message.delete().catch(err => {});
    if (msg) return msg.delete().catch(err => {});
  });
  })
  }
};