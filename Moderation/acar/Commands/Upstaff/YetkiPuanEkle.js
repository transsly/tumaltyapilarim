const { MessageEmbed } = require("discord.js");
const Upstaffs = require('../../../Database/Schema/Upstaffs');
const { Upstaff } = require('../../../Database/acarDatabase');
const moment = require('moment');
require('moment-duration-format');
require('moment-timezone');

module.exports = {
    Isim: "yetkipuan",
    Komut: ["altyetkipuan","yetkipuanekle"],
    Kullanim: "yetkipuan <@sehira/ID> <Puan>",
    Aciklama: "Belirlenen üyeyi terfi sistemine senkronize eder.",
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
    let embed = new MessageEmbed().setAuthor(ayarlar.embed.başlık, message.guild.iconURL({dynamic: true})).setColor(ayarlar.embed.renk).setFooter(ayarlar.embed.altbaşlık)
    if(!uPConf.sistem) return; 
    if(!sistem.staff.find(x => x.id == message.member.id) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku))) return;
    let kullArray = message.content.split(" ");
    let kullArgs = kullArray.slice(0);
    let uye = message.mentions.members.first() || message.guild.members.cache.get(kullArgs[1]) || message.guild.members.cache.find(x => x.user.username.toLowerCase() === kullArgs.slice(1).join(" ") || x.user.username === kullArgs[1])
    if(!uye) return message.channel.send(cevaplar.üye + ` \`${sistem.prefix}${module.exports.Isim} <@sehira/ID> <Puan>\``).then(x => x.delete({timeout: 5000}));
    if(!uye.user.username.includes(ayarlar.tag)) return message.channel.send(`${cevaplar.prefix} Belirtilen üyenin isminde \`${ayarlar.tag}\` bulunmadığından dolayı yetki puanı eklenemedi.`).then(x => x.delete({timeout: 7500}));
    if(message.author.id === uye.id) return message.channel.send(cevaplar.kendi).then(x => x.delete({timeout: 5000}));
    let yetkiKodu = parseInt(args[1]);
    if(isNaN(yetkiKodu)) return message.channel.send(cevaplar.argümandoldur + ` \`${sistem.prefix}${module.exports.Isim} <@sehira/ID> <Puan>\``);
    await Upstaff.addPoint(uye.id, yetkiKodu, "Bonus")
    message.guild.kanalBul("senk-log").send(embed.setDescription(`${message.member} (\`${message.member.id}\`) isimli yetkili ${uye} (\`${uye.id}\`) isimli üyeye \`${yetkiKodu}\` yetki puanı ekledi.`));
    message.react(emojiler.Onay)
  }
};