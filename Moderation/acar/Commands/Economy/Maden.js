const { Client, Message, MessageEmbed} = require("discord.js");
const Coins = require('../../../Database/Schema/Coins');
const moment = require("moment");
require("moment-duration-format");
require("moment-timezone");
const Beklet = new Set();

module.exports = {
    Isim: "maden",
    Komut: ["madenegit", "madenegönder"],
    Kullanim: "maden",
    Aciklama: "Madene gönderdiğin bir işçi sana maden getirebilir dikkat etmesi gerek yaratıkla kapışırken kazması hasar görebilir.",
    Kategori: "Economy",
    Extend: false,
    
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
if(!kanallar.coinChat.some(x => message.channel.id == x) && !sistem.staff.find(x => x.id == message.member.id)) return message.channel.send(`${message.guild.emojiGöster(emojiler.Iptal)} Sadece ${kanallar.coinChat.map(x => message.guild.channels.cache.get(x)).join(",")} kanalların da oynayabilirsin.`).then(x => x.delete({timeout: 3500}));
    if(Beklet.has(message.author.id)) return message.channel.send(`${cevaplar.prefix} Bir saat de bir dafa oynayabilirsin.`).then(x => x.delete({timeout: 3000}));
    let embed = new MessageEmbed().setAuthor(ayarlar.embed.başlık, message.guild.iconURL({dynamic: true, size: 2048})).setColor(ayarlar.embed.renk)
    let uye = message.guild.member(message.member);
    let Hesap = await Coins.findById(uye.id)
    let Miktar = Math.floor(Math.random() * 28000) + 2000;
    let Coin = Hesap ? Hesap.Coin : 0
    if(Coin < 500) return message.channel.send(`${cevaplar.prefix} Maalesef kazmanın kırılma ihtimalini düşünüyorum onun için en az \`500\` ${message.guild.emojis.cache.get(emojiler.Görev.Para)} ihtiyacım var.`).then(x => x.delete({timeout: 8500}));
    await Coins.updateOne({_id: uye.id }, {$inc: { Coin: -500}}).exec();
    Beklet.add(message.author.id);
    message.channel.send(embed.setThumbnail('https://reygif.com/media/5/minero-y-pico-de-videojuego-72276.gif').setDescription(`${message.guild.emojiGöster(emojiler.Görev.Kek)} En kısa zaman da madeni bulacağıma inanıyorum azıcık sen de sabredersen sana güzel elmaslar güzel altınlar çıkaracağım.`)).then(msg => {
        setTimeout(async () => {
            let rnd = Math.floor(Math.random() * 5), result;
            if(rnd == 1){
                result = `buldum ben buldum. ${message.guild.emojiGöster(emojiler.Konfeti)} (\`+${Miktar}\` ${message.guild.emojis.cache.get(emojiler.Görev.Para)})`;
                Miktar = Number(Miktar);
                let coin = Miktar;
                embed.setThumbnail('https://www.animatedimages.org/data/media/1364/animated-miner-image-0024.gif')
                await Coins.updateOne({_id: uye.id }, {$inc: { Coin: Number(coin)}}).exec();
            }
            else {
                result = `__bulamadım üzgünüm__ ve elimde ki kazmayı __ACAR__ yaratığı bana saldırdığı için kendimi kazmam ile korudum.\n\nKazmam hasar gördüğü için \`-500\` ${message.guild.emojis.cache.get(emojiler.Görev.Para)} kasandan almak zorunda kaldım. Üzgünüm :( `;
                embed.setThumbnail('https://www.hareketligifler.net/data/media/1364/madenci-hareketli-resim-0021.gif')
            }
            
            msg.edit(embed.setDescription(`${rnd == 1 ?  message.guild.emojiGöster(emojiler.Görev.OK) : message.guild.emojiGöster(emojiler.Iptal)} ${message.member} Ufak bir maden araştırması yaparken, bir maden ${result}`));
            msg.delete({timeout: 10000})    
            setTimeout(() => {
                Beklet.delete(message.author.id);
            }, 3600000);    
        }, 4000);
        
    });

    }
};

