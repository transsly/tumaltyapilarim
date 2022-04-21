const { Client, Message, MessageEmbed } = require("discord.js");

const Users = require('../../../Database/Schema/Users')
module.exports = {
    Isim: "komutdenetim",
    Komut: ["komutkullanimi"],
    Kullanim: "komutdenetim @sehira/ID",
    Aciklama: "Bir üyenin kullandığı komut geçmişini gösterir.",
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
    const embed = new MessageEmbed()
    .setAuthor(ayarlar.embed.başlık, message.guild.iconURL({dynamic: true}))
    .setColor(ayarlar.embed.renk)
    .setFooter(ayarlar.embed.altbaşlık)
    if(roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku))  && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(cevaplar.noyt); 
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!uye) return message.channel.send(cevaplar.üye + ` \`${sistem.prefix}${module.exports.Isim} @sehira/ID\``).then(x => x.delete({timeout: 5000}));
    if(uye.user.bot) return message.channel.send(cevaplar.bot);  
    let currentPage = 1;
    await Users.findOne({ id: uye.id }).sort([["descending"]]).exec(async (err, pageArray) => {
        if (!pageArray) return message.channel.send(`${cevaplar.prefix} ${uye} \`üyesinin komut bilgisi veritabanında bulunmadı.\``).then(x => x.delete({timeout: 7500}));
        let pages = pageArray.Loglar.sort((a, b) => b.Tarih - a.Tarih).filter(x => x.Komut !== "komutdenetim" && x.Komut !== "eval").chunk(20);
        if (!pages.length || !pages[currentPage - 1].length) return message.channel.send(`${cevaplar.prefix} \`Belirtilen üyenin komut bilgisi bulunamadı.\``).then(x => x.delete({timeout: 7500}));
        let msg = await message.channel.send(embed.setDescription(`${message.guild.emojiGöster(emojiler.Tag)} ${uye} üyesinin komut listesi yükleniyor... Lütfen bekleyin.`));
        let reactions = ["◀", "❌", "▶"];
        for (let reaction of reactions) await msg.react(reaction);
            if (msg) await msg.edit(embed.setDescription(`${uye} sunucu boyu kullandığı komut listesi aşağıda listelenmiştir.\n\n${pages[currentPage - 1].map((x) => `\`${sistem.prefix}${x.Komut}\` (\`${tarihsel(x.Tarih)}\`) (${x.Kanal ? message.guild.channels.cache.get(x.Kanal) ? message.guild.channels.cache.get(x.Kanal) : "#Silinmiş Kanal" : "#Silinmiş Kanal"})`).join("\n")}`))

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
      if (msg) msg.edit(embed.setDescription(`${pages[currentPage - 1].map((x) => `\`${sistem.prefix}${x.Komut}\` (\`${tarihsel(x.Tarih)}\`) (${x.Kanal ? message.guild.channels.cache.get(x.Kanal) ? message.guild.channels.cache.get(x.Kanal) : "#Silinmiş Kanal" : "#Silinmiş Kanal"})`).join("\n")}`))
    });
    go.on("collect", async reaction => {
      await reaction.users.remove(message.author.id).catch(err => {});
      if (currentPage == pages.length) return;
      currentPage++;
      if (msg) msg.edit(embed.setDescription(`${pages[currentPage - 1].map((x) => `\`${sistem.prefix}${x.Komut}\` (\`${tarihsel(x.Tarih)}\`) (${x.Kanal ? message.guild.channels.cache.get(x.Kanal) ? message.guild.channels.cache.get(x.Kanal) : "#Silinmiş Kanal" : "#Silinmiş Kanal"})`).join("\n")}`))
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