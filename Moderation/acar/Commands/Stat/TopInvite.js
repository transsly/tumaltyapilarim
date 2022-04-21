const { Client, Message, MessageEmbed} = require("discord.js");
const Invite = require('../../../Database/Schema/Invites')
module.exports = {
    Isim: "topdavet",
    Komut: ["topinvite"],
    Kullanim: "topinvite",
    Aciklama: "Sunucu içerisindeki tüm davet sıralaması görüntülenir",
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
    const embed = new MessageEmbed().setColor(ayarlar.embed.altbaşlık).setColor(ayarlar.embed.renk).setAuthor(ayarlar.embed.başlık, message.guild.iconURL({dynamic: true, size: 2048})).setDescription(`${message.guild.emojiGöster(emojiler.Terfi.icon)} \`davet sıralaması yüklenirken lütfen bekleyin.\``).setFooter(`${ayarlar.embed.altbaşlık}`);
    let currentPage = 1;
    Invite.find({guildID: message.guild.id}).sort().exec(async (err, pageArray) => {
      pageArray = pageArray.filter(x => message.guild.members.cache.has(x.userID)).sort((uye1, uye2) => ((uye2.regular ? uye2.regular : 0)+(uye2.bonus ? uye2.bonus : 0))-((uye1.regular ? uye1.regular : 0)+(uye1.bonus ? uye1.bonus : 0)));
      if (err) console.log(err);
      if (!pageArray.length) {
        message.channel.send('Hata: \`Davet verisi bulunamadı!\`');
      } else {
        let pages = pageArray.chunk(10);
        if (!pages.length || !pages[currentPage - 1].length) return message.channel.send(`Hata: \`Daveti bulunan üye bulunamadı!\``);
        let msg = await message.channel.send(embed);
        let reactions = ["◀", "❌", "▶"];
        for (let reaction of reactions) await msg.react(reaction);
        if (msg) await msg.edit(embed.setDescription(`${pages[currentPage - 1].map((kisi, index) => `\`${index == 0 ? `👑` : `${index+1}.`}\` ${message.guild.members.cache.get(kisi.userID).toString()} \`${kisi.regular+kisi.bonus} davet\` ${kisi.userID == message.member.id ? `**(Siz)**` : ``}`).join('\n')}`).setFooter(`${ayarlar.embed.altbaşlık} • ${currentPage}. Sayfa`));
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
            if (msg) msg.edit(embed.setDescription(`${pages[currentPage - 1].map((kisi, index) => `\`${index == 0 ? `👑` : `${index+1}.`}\` ${message.guild.members.cache.get(kisi.userID).toString()} \`${kisi.regular+kisi.bonus} davet\` ${kisi.userID == message.member.id ? `**(Siz)**` : ``}`).join('\n')}`).setFooter(`${ayarlar.embed.altbaşlık} • ${currentPage}. Sayfa`));
          });
          go.on("collect", async reaction => {
            await reaction.users.remove(message.author.id).catch(err => {});
              if (currentPage == pages.length) return;
              currentPage++;
              if (msg) msg.edit(embed.setDescription(`${pages[currentPage - 1].map((kisi, index) => `\`${index == 0 ? `👑` : `${index+1}.`}\` ${message.guild.members.cache.get(kisi.userID).toString()} \`${kisi.regular+kisi.bonus} davet\` ${kisi.userID == message.member.id ? `**(Siz)**` : ``}`).join('\n')}`).setFooter(`${ayarlar.embed.altbaşlık} • ${currentPage}. Sayfa`));
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