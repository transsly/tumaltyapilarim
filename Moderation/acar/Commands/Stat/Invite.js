const { Client, Message, MessageEmbed} = require("discord.js");
const Invite = require('../../../Database/Schema/Invites')
module.exports = {
    Isim: "invite",
    Komut: ["davet","davetlerim"],
    Kullanim: "invite <@sehira/ID>",
    Aciklama: "Belirtilen üye veya komutu kullanan üyenin davet bilgilerini görüntüler.",
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
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    const embed = new MessageEmbed().setColor(ayarlar.embed.altbaşlık).setColor(ayarlar.embed.renk).setAuthor(ayarlar.embed.başlık, message.guild.iconURL({dynamic: true, size: 2048})).setFooter(ayarlar.embed.altbaşlık)
    Invite.findOne({guildID: message.guild.id, userID: uye.id}, (err, inviterData) => {
      if (!inviterData) {
        embed.setDescription(`${cevaplar.prefix} \`Davet bilgileri bulunmamaktadır.\``);
        message.channel.send(embed);
      } else {
        Invite.find({guildID: message.guild.id, inviterID: uye.id}).sort().exec((err, inviterMembers) => {
          let dailyInvites = 0;
          if (inviterMembers.length) {
            dailyInvites = inviterMembers.filter(x => message.guild.members.cache.has(x.userID) && (Date.now() - message.guild.members.cache.get(x.userID).joinedTimestamp) < 1000*60*60*24).length;
          };
          embed.setDescription(`${uye} isimli üye toplam **${inviterData.regular+inviterData.bonus}** davete sahip! (**${inviterData.regular}** gerçek, **${inviterData.bonus}** bonus, **${inviterData.fake}** fake, **${dailyInvites}** günlük)`);
          message.channel.send(embed);
        });
      };
    });
    

    }
};