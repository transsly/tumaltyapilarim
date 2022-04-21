const { Client, Message, MessageEmbed } = require("discord.js");

const Tasks = require('../../../Database/Schema/Managements');

module.exports = {

    Isim: "yönetimpuan",
    Komut: ["yonetimpuan", "puanver"],
    Kullanim: "puanekle <@sehira/ID>",
    Aciklama: "",
    Kategori: "Yönetim Sistemi",
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
    if(!taskConf.sistem) return;
    if(!taskConf.puanlama.sistem) return;
    let embed = new MessageEmbed().setAuthor(ayarlar.embed.başlık, message.guild.iconURL({dynamic: true, size: 2048})).setColor(ayarlar.embed.renk).setFooter(ayarlar.embed.altbaşlık)
    let kullArray = message.content.split(" ");
    let kullArgs = kullArray.slice(0);
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(x => x.user.username.toLowerCase() === kullArgs.slice(1).join(" ") || x.user.username === kullArgs[0])
    if(!roller.kurucuRolleri.some(x => message.member.roles.cache.has(x)) && !sistem.staff.find(x => x.id == message.member.id)) return;
    if(!uye) return message.channel.send(cevaplar.üye + ` \`${sistem.prefix}${module.exports.Isim} <@sehira/ID> <Puan>\``).then(x => x.delete({timeout: 5000}));
    let veri = args[1];
    if(!veri) return message.channel.send(cevaplar.prefix + `Lütfen belirtilen üyeye bir puan verebilmem için bir puan belirtin. \`${sistem.prefix}${module.exports.Isim} <@sehira/ID> <Puan>\``).then(x => x.delete({timeout: 5000}));
    await Tasks.updateOne({_id: uye.id}, { $inc: { "BonusPuan": Number(veri), "Puan": Number(veri) } }, {upsert: true});
    message.guild.kanalBul("task-log").send(embed.setDescription(`${message.author} isimli yetkili ${uye.toString()} isimli üyeye \`${tarihsel(Date.now())}\` tarihinde \`${veri} puan\` ekledi / çıkardı !`))
    message.react(emojiler.Onay)
    }
};