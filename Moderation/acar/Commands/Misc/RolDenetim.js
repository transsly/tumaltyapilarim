const { Client, Message, MessageEmbed, MessageAttachment} = require("discord.js");
module.exports = {
    Isim: "roldenetim",
    Komut: ["roldenetim"],
    Kullanim: "roldenetim <Rol-ID>",
    Aciklama: "Belirtilen bir rolün üyelerinin seste olup olmadığını ve rol bilgilerini gösterir.",
    Kategori: "Yönetim",
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
    let embed = new MessageEmbed().setAuthor(ayarlar.embed.başlık, message.guild.iconURL({dynamic: true, size: 2048})).setColor(ayarlar.embed.renk)
    if(!roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(cevaplar.noyt); 
    let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);
    if(!role) return message.channel.send(`${cevaplar.prefix} \`Rol Belitrilmedi!\` Lütfen bir rol etiketleyin veya IDsini girin.` + ` \`${sistem.prefix}${module.exports.Isim} <Rol ID>\``);
    let members = role.members.array();
    let sesteOlmayanlar = members.filter(member => !member.voice.channelID);  
    let sesteOlanlar = members.filter(member => member.voice.channel);
     message.channel.send("Rol Bilgisi : " + role.name + " | " + role.id + " | " + role.members.size + " Toplam Üye | " + sesteOlmayanlar.length + " Seste Olmayan Üye" , { code: "fix", split: true });
     if(sesteOlanlar.length >= 1) message.channel.send(embed.setDescription(`\`${role.name}\` isimli rolde seste bulunan üyeleri aşağı sıraladım kopyalarak etiket atabilirsin veya profillerini görebilirsin.\n\`\`\`${sesteOlanlar.join(`, `)}\`\`\``)).catch(acar => {
      let dosyahazırla = new MessageAttachment(Buffer.from(sesteOlanlar.slice().join(`\n`)), `${role.id}-sesteolanlar.txt`);
      message.channel.send(`:no_entry_sign: ${role.name} isimli rolün __seste olanları__ **Discord API** sınırını geçtiği için metin belgesi hazırlayıp gönderdim.`, dosyahazırla)});
     if(sesteOlmayanlar.length >= 1) message.channel.send(`${sesteOlmayanlar.slice(0, sesteOlmayanlar.length/1).join(`, `)}`, { code: "diff", split: true}).catch(acar => {
      let dosyahazırla = new MessageAttachment(Buffer.from(sesteOlmayanlar.slice().join(`\n`)), `${role.id}-sesteolmayanlar.txt`);
      message.channel.send(`:no_entry_sign: ${role.name} isimli rolün __seste olmayanları__ **Discord API** sınırını geçtiği için metin belgesi hazırlayıp gönderdim.`, dosyahazırla)});
   }
};