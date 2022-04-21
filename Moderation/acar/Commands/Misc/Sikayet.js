const { Client, Message, MessageEmbed} = require("discord.js");

module.exports = {
    Isim: "şikayet",
    Komut: ["sikayet"],
    Kullanim: "şikayet <@sehira/ID> <chat-sesli-taciz-dm> <Şikayet Açıklaması>",
    Aciklama: "şikayet <@sehira/ID> <chat-sesli-taciz-dm> <Şikayet Açıklaması>",
    Kategori: "Misc",
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
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || await client.getUser(args[0]);
    if(!uye) return message.channel.send(cevaplar.üye + ` \`${sistem.prefix}${module.exports.Isim} <@sehira/ID> <chat-sesli-taciz-dm> <Şikayet Açıklaması>\``).then(x => x.delete({timeout: 5000})); 
    if(uye.user.bot) return message.channel.send(cevaplar.bot);
    if(message.author.id === uye.id) return message.channel.send(cevaplar.kendi).then(amınakoy => amınakoy.delete({timeout: 5000}));
    let sikayetciCezapuani = await client.cezaPuan(message.member.id) || 0;
    let sikayetedilenCezapuani = await client.cezaPuan(uye.id) || 0;
    let tür = args[1];
    if(tür !== "chat" && tür !== "sesli" && tür !== "taciz" && tür !== "dm") return message.channel.send(cevaplar.argümandoldur + ` \`${sistem.prefix}${module.exports.Isim} <@sehira/ID> <chat-sesli-taciz-dm> <Şikayet Açıklaması>\``).then(x => x.delete({timeout: 5000})); 
    let şikayetbilgi = args.slice(2).join(' ');
    if(!şikayetbilgi) return message.channel.send(cevaplar.argümandoldur + ` \`${sistem.prefix}${module.exports.Isim} <@sehira/ID> <chat-sesli-taciz-dm> <Şikayet Açıklaması>\``).then(x => x.delete({timeout: 5000})); 
    message.react(emojiler.Onay)
    message.channel.send(`${message.guild.emojiGöster(emojiler.Onay)} Şikayetiniz yetkililere başarıyla iletilmiştir en kısa zamanda sonuçlandırılacaktır.`).then(x => {
      message.guild.kanalBul("şikayetler").send(embed.setDescription(`${uye} kişisi ${message.author} tarafından **${tür}** türü nedeniyle şikayet edildi.`).addField('__**Şikayetçi**__',`
ID: \`${message.author.id}\`
Profil: ${message.author}
Ceza Puanı: \`${sikayetciCezapuani}\`
`,true).addField('__**Şikayet Edilen**__', `
ID: \`${uye.id}\`
Profil: ${uye}
Ceza Puanı: \`${sikayetedilenCezapuani}\``,true).addField(`__**Şikayet Bilgisi**__`, `
Şikayet Türü: \`${tür}\`
Şikayet Tarihi: \`${tarihsel(Date.now())}\``,true).addField(`__**Şikayet Açıklaması**__`, `\`${şikayetbilgi}\``,true))
      x.delete({timeout: 7500})
    })
    }
};