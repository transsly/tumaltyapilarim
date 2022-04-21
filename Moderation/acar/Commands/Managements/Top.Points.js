const { Client, Message, MessageEmbed } = require("discord.js");
const moment = require('moment');
require('moment-duration-format');
require('moment-timezone');
const Stats = require('../../../Database/Schema/Stats');
const Taskdata = require('../../../Database/Schema/Managements');
const { MessageButton } = require('discord-buttons');

module.exports = {
    Isim: "top-puan",
    Komut: ["toppuan","toppuanlar","topyetkipuan"],
    Kullanim: "top-puan",
    Aciklama: "Yönetim puanınızı görüntüler.",
    Kategori: "Yönetim Sistemi",
    Extend: true,
    
   /**
   * @param {Client} client 
   */
  onLoad: function (client) {
    client.yetkiliSesSureCevir = (date) => { return moment.duration(date).format('H'); };
  },

   /**
   * @param {Client} client 
   * @param {Message} message 
   * @param {Array<String>} args 
   */

  onRequest: async function (client, message, args) {
    if(!taskConf.puanlama.sistem) return;
    let embed = new MessageEmbed().setAuthor(ayarlar.embed.başlık, message.guild.iconURL({dynamic: true})).setColor(ayarlar.embed.renk)
    const all = await Taskdata.find().sort({ Puan: "descending" });
    let teyit = all.slice(0, 20).map((value, index) => `\`${index == 0 ? `👑` : index+1}.\` ${value.id ? message.guild.members.cache.get(value._id) ? message.guild.members.cache.get(value._id) : `<@${value._id}>` : `<@${value._id}>`} \`${value.Puan} Puan\` ${value._id == message.member.id ? `**(Siz)**` : ``}`).slice(0, 20)
    message.channel.send(embed.setDescription(`${teyit.join("\n") || "Sunucu içerisinde yetki puan datası bulunamadı!"}`).setFooter(ayarlar.embed.altbaşlık));
  }
};
