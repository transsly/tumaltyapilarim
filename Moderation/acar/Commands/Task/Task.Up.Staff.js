const { Client, Message, MessageEmbed } = require("discord.js");

const Stats = require('../../../Database/Schema/Stats');
const Tasks = require('../../../Database/Schema/Managements');

module.exports = {

    Isim: "görevatlat",
    Komut: ["gorevatlat", "görev-ok"],
    Kullanim: "görev-ok <@sehira/ID>",
    Aciklama: "",
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
    if(!taskConf.sistem) return;
    if(taskConf.puanlama.sistem) return;
    let embed = new MessageEmbed().setAuthor(ayarlar.embed.başlık, message.guild.iconURL({dynamic: true, size: 2048})).setColor(ayarlar.embed.renk).setFooter(ayarlar.embed.altbaşlık)
    let kullArray = message.content.split(" ");
    let kullArgs = kullArray.slice(0);
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(x => x.user.username.toLowerCase() === kullArgs.slice(1).join(" ") || x.user.username === kullArgs[0])
    if(!roller.kurucuRolleri.some(x => message.member.roles.cache.has(x)) && !sistem.staff.find(x => x.id == message.member.id)) return;
    if(!uye) return message.channel.send(cevaplar.üye + ` \`${sistem.prefix}${module.exports.Isim} <@sehira/ID>\``).then(x => x.delete({timeout: 5000}));
    let newMap = new Map();
    await Stats.updateOne({ userID: uye.id }, { taskVoiceStats: newMap });
    await Tasks.findByIdAndDelete(uye.id);
    let görevBilgisi = taskConf.görevler[taskConf.görevler.indexOf(taskConf.görevler.find(x => uye.roles.cache.has(x.rol)))] || taskConf.görevler[taskConf.görevler.length-1];
    let YeniRol = taskConf.görevler[taskConf.görevler.indexOf(görevBilgisi)+1];
    if(görevBilgisi && YeniRol) uye.roles.remove(görevBilgisi.rol)
    if(YeniRol) await uye.roles.add(YeniRol.rol)
    if(!YeniRol) return message.channel.send(cevaplar.prefix + ' `Yükseltilebilecek bir rol veya bir yetki bulunamadı ve yükseltme işlemi iptal edildi.`').then(x => { 
      x.delete({timeout: 3500}) 
      message.react(emojiler.Iptal)
    });
    message.react(emojiler.Onay)
    message.guild.kanalBul("task-log").send(embed.setDescription(`${message.author} isimli yetkili ${uye.toString()} isimli üyeyi \`${tarihsel(Date.now())}\` tarihinde ${YeniRol ? message.guild.roles.cache.get(YeniRol.rol): "@Rol Bulunamadı"} isimli role yükseltti!`))
    await message.channel.send(`${message.guild.emojiGöster(emojiler.Onay)} ${uye} isimli yetkilinin görevleri tamamlanıp bir üst perme yerleştirildi.`)
    }
};