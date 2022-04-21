const { Client, Message, MessageEmbed, Guild, MessageAttachment } = require("discord.js");
const Snipe = require('../../../Database/Schema/Snipes')
const moment = require('moment');
require("moment-duration-format");
require("moment-timezone");
module.exports = {
    Isim: "snipe",
    Komut: ["snipe"],
    Kullanim: "snipe",
    Aciklama: "Komutun kullanıldığı kanal da en son silinmiş mesajın içeriğini ve tarihini gösterir.",
    Kategori: "Yönetim",
    Extend: true,
  /**
   * @param {Client} client 
   */
  onLoad: function (client) {
    client.on("messageDelete", async message => {
        if (message.channel.type === "dm" || !message.guild || message.author.bot) return;
        await Snipe.updateOne({ _id: message.channel.id }, { $set: {  
            "yazar": message.author.id, 
            "yazilmaTarihi": message.createdTimestamp,
            "silinmeTarihi": Date.now(), 
            "dosya": message.attachments.first() ? true : false,
	    "icerik": message.content ? message.content : ""
          } }, { upsert: true }).exec();
 
    });
  },
  /**
   * @param {Client} client 
   * @param {Message} message 
   * @param {Array<String>} args 
   * @param {Guild} guild
   */
  onRequest: async function (client, message, args, guild) {
    if(!roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.altYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) &&  !roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(cevaplar.noyt);
    let mesaj = await Snipe.findById(message.channel.id)
    if (!mesaj) return message.channel.send('Hata: Bu Kanalda silinmiş bir mesaj yok!').then(x => x.delete({timeout: 5000}));
    let mesajYazari = await client.users.fetch(mesaj.yazar);
    let embed = new MessageEmbed().setDescription(`\`Atan Kişi:\` ${mesajYazari} \n\`Yazılma Tarihi:\` ${moment.duration(Date.now() - mesaj.yazilmaTarihi).format("D [gün], H [saat], m [dakika], s [saniye]")} önce\n\`Silinme Tarihi:\` ${moment.duration(Date.now() - mesaj.silinmeTarihi).format("D [gün], H [saat], m [dakika], s [saniye]")} önce ${mesaj.dosya ? "\n**Atılan mesaj dosya içeriyor**" : ""}`).setAuthor(mesajYazari.tag, mesajYazari.avatarURL()).setFooter(ayarlar.embed.altbaşlık).setColor(ayarlar.embed.altbaşlık);
    if (mesaj.icerik) embed.addField('Mesajın İçeriği', mesaj.icerik);
    let acardörtbin;
    if (mesaj.icerik) acardörtbin = mesaj.icerik
    message.channel.send(embed).then(x => x.delete({timeout: 15000})).catch(err => {
      let dosyahazırla = new MessageAttachment(Buffer.from(acardörtbin), `${mesaj.yazar}-snipe.txt`);
      message.channel.send(`${message.guild.emojis.cache.get(emojiler.ChatSusturuldu)} ${message.guild.members.cache.get(mesaj.yazar)} (\`${moment.duration(Date.now() - mesaj.yazilmaTarihi).format("D [gün], H [saat], m [dakika], s [saniye]")} önce yazılma / ${moment.duration(Date.now() - mesaj.silinmeTarihi).format("D [gün], H [saat], m [dakika], s [saniye]")} önce silinme\`) üyesi karakter sayısını aşan bir metin gönderdiği için **Discord API** buna izin vermedi, bende senin için dosya hazırladım.`, dosyahazırla)
    });
    }
}