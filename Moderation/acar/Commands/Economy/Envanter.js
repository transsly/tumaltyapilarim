const { Client, Message, MessageEmbed} = require("discord.js");
const Coins = require('../../../Database/Schema/Coins');
const moment = require("moment");
require("moment-duration-format");
require("moment-timezone");

module.exports = {
    Isim: "envanter",
    Komut: ["envanterim"],
    Kullanim: "envanter",
    Aciklama: "",
    Kategori: "Economy",
    Extend: true,
    
   /**
   * @param {Client} client 
   */
  onLoad: function (client) {
  },

   /**
   * @param {Client} client
   * @param {Message} message
   * @param {Array<String|Number>} args
   * @returns {Promise<void>}
   */

  onRequest: async function (client, message, args) {
    if(!coinConf.sistem) return;
    let embed = new MessageEmbed().setAuthor(ayarlar.embed.başlık, message.guild.iconURL({dynamic: true, size: 2048})).setColor(ayarlar.embed.renk);
    let uye = message.guild.member(message.member);
    let Hesap = await Coins.findOne({_id: uye.id}) || []
    let Coin = Hesap ? Hesap.Coin : 0
    var filter = msj => msj.author.id === message.author.id && msj.author.id !== client.user.id;
    embed.setFooter(ayarlar.embed.altbaşlık + ` • Bakiye: ${Coin} 💴`)
    embed.setDescription(`${uye}, daha önce ürün satın almamışsın.`)
    if(Hesap) {
        if(Hesap.Envanter) {
            let Envanter = Hesap.Envanter.sort((a, b) => b.Tarih - a.Tarih)
            let ÜrünleriListele;
            ÜrünleriListele = Envanter.forEach(x => {
                embed.addField(`${x.UrunEmoji ? message.guild.emojis.cache.get(x.UrunEmoji) ? message.guild.emojis.cache.get(x.UrunEmoji) : message.guild.emojis.cache.get(emojiler.Tag) : "EM-NO"} #${x.UrunID}-${x.UrunIsmi} (\`${x.UrunTuru ? x.UrunTuru == "Rozet" ? "Rozet" : "Normal" : "Normal"}\`)`, `\`${tarihsel(x.Tarih)}\nSatış (-%50) => ${x.UrunFiyat/2}\` ${message.guild.emojis.cache.get(emojiler.Görev.Para)}`, true) 
            })
            embed.setDescription(`${uye}, satın aldığın ürünler burada listelenmektedir. Ürünü satmak için aşağı da beliren tepkiye tıklayarak Ürün ID'si girerek ürün satışına başlayabilirsin.`)
      }
    }

    let msg = await message.channel.send(embed).then(async (m) => {
            await m.react('💱')
          return m;
        })
    let tepki = await msg.awaitReactions((reaction, user) => user.id == message.author.id, { errors: ["time"], max: 1, time: 30000 }).then(coll => coll.first()).catch(err => {  msg.reactions.removeAll(); return; });
    if(!tepki) return;

    if (tepki.emoji.name === '💱') { 
        let sat = await message.channel.send(`${message.guild.emojiGöster(emojiler.Terfi.icon)} Merhaba, Envanterinizden satmak istediğiniz ürünün ID'sini giriniz?`)
        message.channel.awaitMessages(filter, {max: 1, time: 10000}).then(async acar => { 
            let ürünid = acar.first().content
            let satilcakurun = Hesap.Envanter.find(x => x.UrunID == ürünid)
            if(Hesap && Hesap.Envanter.length <= 1) {
                msg = await msg.reactions.removeAll();
                sat.delete();
                msg.delete({timeout: 5000}); 
                return message.channel.send(`${cevaplar.prefix} \`bir veya birden az ürününüz olduğundan satış işlemine izin verilmiyor.\``).then(x => x.delete({timeout: 5000})); 
            }
            if(!satilcakurun) {
              msg = await msg.reactions.removeAll();
              sat.delete();
              msg.delete({timeout: 5000});
              return;
            } else {
              sat.delete();
              let satmaonayla = await message.channel.send(`${message.guild.emojiGöster(emojiler.Terfi.icon)} **#${satilcakurun.UrunID}** numaralı \`${satilcakurun.UrunIsmi}\` isimli ürünü \`${satilcakurun.UrunFiyat/2}\` ${message.guild.emojiGöster(emojiler.Görev.Para)} fiyatına satmak istiyor musun? (__Evet__/__Hayır__)`)
            message.channel.awaitMessages(filter, { errors: ["time"], max: 1, time: 10000})
            .then(async acarsatinal => { 
                if(acarsatinal.first().content.toLowerCase() === "hayır" || acarsatinal.first().content.toLowerCase() === "Hayır") {
                  msg.reactions.removeAll();
                  message.channel.send(`${message.guild.emojiGöster(emojiler.Onay)} \`${satilcakurun.UrunIsmi}\` isimli ürünün satma işlemi iptal edildi.`).then(x => { x.delete({timeout: 5000})});
                  satmaonayla.delete()
                };
                if(acarsatinal.first().content.toLowerCase() === "evet" || acarsatinal.first().content.toLowerCase() === "Evet") {
		    if(!satilcakurun.Sat) {
		      msg.reactions.removeAll();
                      satmaonayla.delete()
                      return message.channel.send('Hata `Bu ürünü satmanız münkün gözükmüyor.`').then(x => x.delete({timeout: 7500})); 
                    } 
                    await Coins.updateOne({_id: uye.id}, { $inc: { Coin: satilcakurun.UrunFiyat/2 }}, {upsert: true})
                    await Coins.updateOne({_id: uye.id}, { $pull: { "Envanter": satilcakurun } }, { upsert: true }).exec();
                    msg.reactions.removeAll();
                    satmaonayla.delete();
                    message.channel.send(`${message.guild.emojiGöster(emojiler.Onay)} Başarıyla \`#${satilcakurun.UrunID}\` numaralı ürün \`${satilcakurun.UrunFiyat/2}\` ${message.guild.emojis.cache.get(emojiler.Görev.Para)} fiyatına satıldı. `)
                    uye.send(`${message.guild.emojiGöster(emojiler.Onay)} Başarıyla \`#${satilcakurun.UrunID}\` numaralı ürün \`${satilcakurun.UrunFiyat/2}\` ${message.guild.emojis.cache.get(emojiler.Görev.Para)} fiyatına **${tarihsel(Date.now())}** tarihinde başarıyla sattın.`).catch(x => {})
                }; 
            })
            }
        }).catch(err => {
            msg.reactions.removeAll();
            sat.delete()
            message.delete()
            msg.delete({timeout: 7500})
            })
    }
    }
};
