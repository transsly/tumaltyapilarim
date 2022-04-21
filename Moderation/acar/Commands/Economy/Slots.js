const { Client, Message, MessageEmbed} = require("discord.js");
const Coins = require('../../../Database/Schema/Coins');
const moment = require("moment");
require("moment-duration-format");
require("moment-timezone");
const Beklet = new Set();

module.exports = {
    Isim: "slots",
    Komut: ["slot", "s"],
    Kullanim: "slots <100-250000-all>",
    Aciklama: "",
    Kategori: "Economy",
    Extend: false,
    
   /**
   * @param {Client} client 
   */
  onLoad: function (client) {
    Array.prototype.random = function() {
        return this[(Math.floor(Math.random()*this.length))];
      };
  },

   /**
   * @param {Client} client
   * @param {Message} message
   * @param {Array<String|Number>} args
   * @returns {Promise<void>}
   */

  onRequest: async function (client, message, args) {
    if(!coinConf.sistem) return;
    if(!kanallar.coinChat.some(x => message.channel.id == x) && !sistem.staff.find(x => x.id == message.member.id)) return message.channel.send(`${message.guild.emojiGöster(emojiler.Iptal)} Sadece ${kanallar.coinChat.map(x => message.guild.channels.cache.get(x)).join(",")} kanalların da oynayabilirsin.`).then(x => x.delete({timeout: 3500}));
    if(Beklet.has(message.author.id)) return message.channel.send(`${cevaplar.prefix} \`Flood!\` Lütfen bir kaç saniye sonra tekrar oynamayı deneyin.`).then(x => x.delete({timeout: 3000}));
    let embed = new MessageEmbed().setAuthor(ayarlar.embed.başlık, message.guild.iconURL({dynamic: true, size: 2048})).setColor(ayarlar.embed.renk).setFooter(ayarlar.embed.altbaşlık);
    let uye = message.guild.member(message.member);
    let Hesap = await Coins.findById(uye.id)
    let Coin = Hesap ? Hesap.Coin : 0
    let Miktar = Number(args[0]);
    if(args[0] == "all") {
        if(Coin >= 250000) Miktar = 250000
        if(Coin < 250000) Miktar = Coin
        if(Coin <= 0) Miktar = 10
    }
    Miktar = Miktar.toFixed(0);
    if(isNaN(Miktar)) return message.channel.send(`${cevaplar.prefix} Miktar yerine harf kullanmamayı tavsiye ederim.`).then(x => x.delete({timeout: 3000}));
    if(Miktar <= 0) return message.channel.send(`${cevaplar.prefix} Göndermek istediğiniz miktar, birden küçük olamaz.`).then(x => x.delete({timeout: 3000}));
    if(Miktar > 250000) return message.channel.send(`${cevaplar.prefix} Bahise en fazla \`250.000\` ${message.guild.emojis.cache.get(emojiler.Görev.Para)} ile girilebilir.`).then(x => x.delete({timeout: 3000}));
    if(Miktar < 10) return message.channel.send(`${cevaplar.prefix} Bahise en az \`10\` ${message.guild.emojis.cache.get(emojiler.Görev.Para)} ile girebilirsiniz.`).then(x => x.delete({timeout: 3000}));
    if(Coin < Miktar) return message.channel.send(`${cevaplar.prefix} \`Belirtiğiniz miktar kadar yeterince bakiye olmadığından dolayı bahse giremezsiniz.\``).then(x => x.delete({timeout: 3000}));
    let KıbrısACAR = ["🍓","🍌","🍒"];
    var SlotOne = KıbrısACAR.random()
    var SlotTwo = KıbrısACAR.random()
    var SlotThree = KıbrısACAR.random()
    await Coins.updateOne({_id: uye.id}, {$inc: { Coin: -Miktar }}).exec();
    Beklet.add(message.author.id);
    message.channel.send(embed.setDescription(`🎰 ${message.author}, \`${Miktar}\` ${message.guild.emojis.cache.get(emojiler.Görev.Para)} ile slot döndürülüyor... (\`🔘:🔘:🔘\`)`)).then(msg => {
        if (SlotOne === SlotTwo && SlotOne === SlotThree) {
        setTimeout(async () => {
            Miktar = Number(Miktar);
            let coin = Miktar * 4;
            await Coins.updateOne({_id: uye.id }, {$inc: { Coin: Number(coin)}}).exec();
            msg.edit(embed.setDescription(`🎰 ${message.author}, \`${Miktar}\` ${message.guild.emojis.cache.get(emojiler.Görev.Para)} ile slot oynadın ve \`${coin}\` ${message.guild.emojis.cache.get(emojiler.Görev.Para)} kazandın. (\`${SlotOne}:${SlotTwo}:${SlotThree}\`)`));    
            Beklet.delete(message.author.id);
            }, 2500);
        } else {
            setTimeout(async () => {
            msg.edit(embed.setDescription(`🎰 ${message.author}, \`${Miktar}\` ${message.guild.emojis.cache.get(emojiler.Görev.Para)} ile slot oynadın fakat **kaybettin**. (\`${SlotOne}:${SlotTwo}:${SlotThree}\`)`));
            Beklet.delete(message.author.id);
            }, 2500);
        }
        });
    }
};

