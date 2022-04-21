const { Client, Message, MessageEmbed} = require("discord.js");
const Coins = require('../../../Database/Schema/Coins');

module.exports = {
    Isim: "günlük",
    Komut: ["günlükcoin","maaş","daily"],
    Kullanim: "günlük",
    Aciklama: "24 Saatte bir belirli bir coin ödülü alırsınız.",
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
    let Hesap = await Coins.findById({_id: uye.id}) 
        if(Hesap && Hesap.GunlukCoin) {
            let yeniGün = Hesap.GunlukCoin + (1*24*60*60*1000);
            if (Date.now() < yeniGün) {
                message.react(emojiler.Iptal)
                return message.channel.send(`${message.guild.emojiGöster(emojiler.Iptal)} Tekrardan günlük ödül alabilmen için **${kalanzaman(yeniGün)}** beklemen gerekiyor.`).then(x => x.delete({timeout: 5000}));
            }
        }
    let Günlük = Math.random();
    Günlük = Günlük*(500-200);
    Günlük = Math.floor(Günlük)+200
    await Coins.updateOne({ _id: uye.id }, { $set: { "GunlukCoin": Date.now() }, $inc: { "Coin": Günlük } }, {upsert: true}).exec();
    await message.react(emojiler.Onay)
    await message.channel.send(embed.setDescription(`${message.guild.emojiGöster(emojiler.Onay)} ${uye} başarıyla \`${Günlük}\` ${message.guild.emojis.cache.get(emojiler.Görev.Para)} ödülünü aldın. **24 Saat** sonra tekrardan ödülünü alabileceksin.`))
   }
};