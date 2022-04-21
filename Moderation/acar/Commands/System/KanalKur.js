const { Client, MessageEmbed} = require("discord.js");
module.exports = {
    Isim: "kanalkur",
    Komut: ["kanalkurulum"],
    Kullanim: "",
    Aciklama: "",
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
    if(!sistem.staff.find(x => x.id == message.member.id)) return;
    let embed = new MessageEmbed().setAuthor(ayarlar.embed.başlık, message.guild.iconURL({dynamic: true})).setColor(ayarlar.embed.renk).setFooter(ayarlar.embed.altbaşlık)
    const log = await message.guild.channels.create("LOG KANALLARI", {
        type: "category",
        permissionOverwrites: [{
            id: message.guild.roles.everyone.id,
            deny: ['VIEW_CHANNEL']
        }]
    });
    kanallar.loglar.some(x => {
        message.guild.channels.create(x, {parent: log});
    })
    message.channel.send(embed.setDescription(`${message.guild.emojiGöster(emojiler.Onay)} \`LOG KANALLARI\` isimli kategori oluşturulup içerisine log kanalları kurulmaya başlandı.`))

    }
};