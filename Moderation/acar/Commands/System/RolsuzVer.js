const { Client, Message, MessageEmbed} = require("discord.js");

module.exports = {
    Isim: "rolsuzver",
    Komut: ["rolsüzver"],
    Kullanim: "rolsüzver # Sunucu içerisinde kayıtsız rolü olana verir.",
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
    let embed = new MessageEmbed().setAuthor(ayarlar.embed.başlık, message.guild.iconURL({dynamic: true})).setColor(ayarlar.embed.renk)
    if(!roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(cevaplar.noyt)
    let rolsuzuye =  message.guild.members.cache.filter(m => m.roles.cache.filter(r => r.id !== message.guild.id).size == 0);
    rolsuzuye.forEach(roluolmayanlar => { 
    roller.kayıtsızRolleri.some(x => roluolmayanlar.roles.add(x)) 
    });
    message.channel.send(embed.setDescription(`Sunucuda rolü olmayan \`${rolsuzuye.size}\` kişiye kayıtsız rolü verildi!`).setFooter(ayarlar.embed.altbaşlık)).then(x => x.delete({timeout: 8000}));
    message.react(emojiler.Onay)
    }
};