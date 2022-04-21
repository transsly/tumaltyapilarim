const { Client, Message, MessageEmbed} = require("discord.js");
const Punitives = require('../../../Database/Schema/Punitives');
const Kullanıcı = require('../../../Database/Schema/Users');
module.exports = {
    Isim: "cezalartemizle",
    Komut: ["cezalartemizle","siciltemizle"],
    Kullanim: "cezalartemizle",
    Aciklama: "Belirtilen ceza numarasının bütün bilgilerini gösterir.",
    Kategori: "-",
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
    if(!sistem.staff.find(x => x.id == message.member.id) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku))) return;
    let embed = new MessageEmbed().setAuthor(ayarlar.embed.başlık, message.guild.iconURL({dynamic: true})).setColor(ayarlar.embed.renk).setFooter(ayarlar.embed.altbaşlık)
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || await client.getUser(args[0])
    if(!uye) return message.channel.send('Hata: \`Belirtilen argümanda bir üye bulunamadı, lütfen geçerli bir üye IDsi veya geçerli bir üye Etiketi ekleyiniz.\`');
    let cezalar = await Punitives.findOne({Uye: uye.id});
    if(!cezalar) return message.channel.send('Hata: `Belirtilen üyenin cezaları boş olduğundan dolayı işlem iptal edildi.`');
    if(await Punitives.findOne({Uye: uye.id, Aktif: true})) return message.channel.send('Hata: `Belirtilen üyenin aktif cezası bulunduğundan dolayı işlem iptal edildi.`');
    await message.channel.send(embed.setDescription(`${message.guild.emojiGöster(emojiler.Onay)} ${uye} üyesinin tüm cezaları başarıyla temizlendi.`))
    await Punitives.updateMany({Uye: uye.id}, { $set: { Uye: `Silindi (${uye.id})`, No: "-99999", Kaldiran: `Sildi (${message.author.id})`} }, { upsert: true });
    await message.react(emojiler.Onay)
    }
};