const { Client, Message, MessageEmbed} = require("discord.js");
const Punitives = require('../../../Database/Schema/Punitives');
const Kullanıcı = require('../../../Database/Schema/Users');
module.exports = {
    Isim: "cezatemizleme",
    Komut: ["cezatemizle"],
    Kullanim: "cezatemizle <#Ceza-No>",
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
    if(!Number(args[0])) return message.channel.send(`Hata: \`Belirtilen argüman bir numaraya benzemiyor lütfen rakam kullanınız.\``)
    let cezabul = await Punitives.findOne({No: args[0]});
    if(!cezabul) return message.channel.send('Hata: `Belirtilen ceza numarasına ait bir ceza bulunamadı, lütfen doğru ceza numarasını giriniz.`');
    if(cezabul && cezabul.Aktif) return message.channel.send('Hata: `belirtilen ceza numarası cezası aktif olduğundan dolayı işlem iptal edildi.`'); 
    await message.channel.send(embed.setDescription(`${message.guild.emojiGöster(emojiler.Onay)} ${cezabul.Uye ? message.guild.members.cache.get(cezabul.Uye) ? message.guild.members.cache.get(cezabul.Uye) : `<@${cezabul.Uye}` : `<@${cezabul.Uye}`} isimli üyeye ait \`#${cezabul.No}\` numaralı ceza sicilden temizlendi.`))
    await Punitives.updateOne({No: args[0]}, { $set: { Uye: `Silindi #${cezabul.No} (${cezabul.Uye})`, No: "-99999", Kaldiran: `Sildi (${message.author.id})`} }, { upsert: true });
    await message.react(emojiler.Onay)
    }
};