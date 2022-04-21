const { Client, Message, MessageEmbed} = require("discord.js");
const Invite = require('../../../Database/Schema/Invites')
module.exports = {
    Isim: "davetdenetim",
    Komut: ["invitedenetim"],
    Kullanim: "davetdenetim <@sehira/ID>",
    Aciklama: "Belirtilen üyenin sunucuya davet ettiği üyeleri listeler.",
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
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    const embed = new MessageEmbed().setColor(ayarlar.embed.altbaşlık).setColor(ayarlar.embed.renk).setAuthor(ayarlar.embed.başlık, message.guild.iconURL({dynamic: true, size: 2048})).setFooter(ayarlar.embed.altbaşlık).setDescription(`${message.guild.emojiGöster(emojiler.Terfi.icon)} \`listelenme yüklerken lütfen bekleyin.\``)
    let currentPage = 1;
    Invite.find({guildID: message.guild.id, inviterID: uye.id}).sort([["descending"]]).exec(async (err, pageArray) => {
      pageArray = pageArray.filter(x => message.guild.members.cache.has(x.userID));
      if (err) console.log(err);
      if (!pageArray.length) {
        Invite.findOne({guildID: message.guild.id, userID: uye.id}, async (err, uyeData) => {
          if (!uyeData) uyeData = {inviterID: null};
          let inviterUye = client.users.cache.get(uyeData.inviterID) || {id: message.guild.id};
          message.channel.send(embed.setDescription(`${uye} (${inviterUye.id == message.guild.id ? message.guild.name : inviterUye.toString()})\n\n${message.guild.emojiGöster(emojiler.Iptal)} \`Sunucuda davet ettiği üye bulunamadı!\``));
        });
      } else {
        let pages = pageArray.chunk(10);
        if (!pages.length || !pages[currentPage - 1].length) return message.channel.send("Hata: `Davet ettiği üye bulunamadı!`");
        let msg = await message.channel.send(embed);
        let reactions = ["◀", "❌", "▶"];
        for (let reaction of reactions) await msg.react(reaction);
        Invite.findOne({guildID: message.guild.id, userID: uye.id}, async (err, uyeData) => {
          let inviterUye = client.users.cache.get(uyeData.inviterID) || {id: message.guild.id};
          if (msg) await msg.edit(embed.setDescription(`${uye} (${inviterUye.id == message.guild.id ? message.guild.name : inviterUye.toString()})\n\n${pages[currentPage - 1].map((kisi, index) => { let kisiUye = message.guild.members.cache.get(kisi.userID); return `\`${index+1}.\` ${kisiUye.toString()} (${global.tarihHesapla(kisiUye.joinedAt)} \`katıldı\`)`; }).join('\n')}`).setFooter(ayarlar.embed.altbaşlık)).catch(err => {});
        });
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
            if (msg) msg.edit(embed.setDescription(`${pages[currentPage - 1].map((kisi, index) => { let kisiUye = message.guild.members.cache.get(kisi.userID); return `\`${index+1}.\` ${kisiUye.toString()} (${global.tarihHesapla(kisiUye.joinedAt)} \`katıldı\`)`; }).join('\n')}`).setFooter(ayarlar.embed.altbaşlık)).catch(err => {});
          });
          go.on("collect", async reaction => {
            await reaction.users.remove(message.author.id).catch(err => {});
            if (currentPage == pages.length) return;
            currentPage++;
            if (msg) msg.edit(embed.setDescription(`${pages[currentPage - 1].map((kisi, index) => { let kisiUye = message.guild.members.cache.get(kisi.userID); return `\`${index+1}.\` ${kisiUye.toString()} | ${global.tarihHesapla(kisiUye.joinedAt)}`; }).join('\n')}`).setFooter(ayarlar.embed.altbaşlık));
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
      };
    });
    

    }
};