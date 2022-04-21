const { Client, Message, MessageEmbed} = require("discord.js");
const Coins = require('../../../Database/Schema/Coins');
module.exports = {
    Isim: "transfer",
    Komut: ["coingönder","cointransfer"],
    Kullanim: "transfer <@sehira/ID> <Miktar>",
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
    let Hesap = await Coins.findById(uye.id)
    let Coin = Hesap ? Hesap.Coin : 0
    let Gönderilen = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!Gönderilen) return message.channel.send(cevaplar.üye + ` \`${sistem.prefix}${module.exports.Isim} <@sehira/ID> <Miktar>\``);
    let Miktar = Number(args[1]);
    if(isNaN(Miktar)) return message.channel.send('Hata: `Lütfen miktar yerine harf girmeyin rakam kullanın.`')
    Miktar = Miktar.toFixed(0);
    if(Miktar <= 0) return message.channel.send('Hata: `Göndermek istediğiniz miktar 1 dan küçük olamaz.`');
    if(Coin < Miktar) return message.channel.send('Hata: `Maalesef yeterli bakiyen bulunamadı.`');
    await Coins.updateOne({_id: uye.id}, { $inc: { Coin: -Miktar }}, {upsert: true})
    await Coins.updateOne({_id: uye.id}, { $push: { "Transferler": { Uye: Gönderilen.id, Tutar: Miktar, Tarih: Date.now(), Islem: "Gönderilen" } }}, {upsert: true})
    await Coins.updateOne({_id: Gönderilen.id}, { $push: { "Transferler": { Uye: uye.id, Tutar: Miktar, Tarih: Date.now(), Islem: "Gelen" } }}, {upsert: true})
    await Coins.updateOne({_id: Gönderilen.id}, { $inc: { Coin: Miktar }}, {upsert: true})
    await message.react(emojiler.Onay)
    await message.channel.send(embed.setDescription(`${message.guild.emojiGöster(emojiler.Onay)} ${Gönderilen} üyesine başarıyla \`${Miktar}\` ${message.guild.emojis.cache.get(emojiler.Görev.Para)} gönderdin.`))
    }
};