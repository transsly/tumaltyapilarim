const { Client, Message, MessageEmbed} = require("discord.js");
const { Upstaff } = require("../../../Database/acarDatabase");
const Users = require('../../../Database/Schema/Users');
module.exports = {
    Isim: "taglı",
    Komut: ["tagaldır","tagli"],
    Kullanim: "taglı <@sehira/ID>",
    Aciklama: "Belirlenen üyeyi komutu kullanan üyenin taglısı olarak belirler.",
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
    if(!roller.teyitciRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.Yetkiler.some(oku => message.member.roles.cache.has(oku)) && !roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.altYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.Yetkiler.some(oku => message.member.roles.cache.has(oku)) && !roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(cevaplar.noyt);
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if(!uye) return message.channel.send(cevaplar.üye + ` \`${sistem.prefix}${module.exports.Isim} <@sehira/ID>\``);
    if(message.author.id === uye.id) return message.channel.send(cevaplar.kendi).then(x => x.delete({timeout: 5000}));
    if(!uye.user.username.includes(ayarlar.tag)) return message.channel.send(`${cevaplar.prefix} ${uye} isimli üyenin isminde \`${ayarlar.tag}\` sembolü bulunamadığından iptal edildi.`);
    let kontrol = await Users.findOne({id: uye.id})
    if(kontrol && kontrol.Taglandı) return message.channel.send(`${cevaplar.prefix} ${uye} isimli üye zaten bir başkası tarafından taglı olarak belirlenmiş.`);
    embed.setDescription(`${message.member.toString()} isimli yetkili seni taglı olarak belirlemek istiyor. Kabul ediyor musun?`);
    const msg = await message.channel.send(uye.toString(), { embed });
    msg.react("✅");
    msg.react("❌");
    msg.awaitReactions((reaction, user) => ["✅", "❌"].includes(reaction.emoji.name) && user.id === uye.user.id, {
      max: 1,
      time: 30000,
      errors: ['time']
    }).then(async collected => {
      const reaction = collected.first();
      if (reaction.emoji.name === '✅') {
        await Users.updateOne({ id: uye.id }, { $set: { "Taglandı": true, "Taglayan": message.member.id } }, { upsert: true }).exec();
        await Users.updateOne({ id: message.member.id }, { $push: { "Taglılar": { id: uye.id, Tarih: Date.now() } } }, { upsert: true }).exec();
        if(uPConf.sistem) await Upstaff.addPoint(message.member.id, uPConf.odül.taglı, "Taglı")
        if(taskConf.sistem && taskConf.yetkiler.some(x => message.member.roles.cache.has(x)) && !message.member.roles.cache.has(taskConf.görevsonyetki)) await message.member.taskAdd("Taglı", 1).catch(x => {})
        if(coinConf.sistem) await message.member.coinAdd(coinConf.Ödül.Taglı).catch(x => {})
        msg.edit(embed.setDescription(`${message.guild.emojiGöster(emojiler.Onay)} ${uye.toString()} üyesi ${message.author} tarafından \`${tarihsel(Date.now())}\` tarihinde başarıyla taglı olarak belirledi!`));
        msg.reactions.removeAll();
        message.guild.kanalBul("taglı-log").send(embed.setDescription(`${uye} isimli üye \`${tarihsel(Date.now())}\` tarihinde ${message.author} tarafından taglı olarak belirlendi.`))
      } else {
        embed.setColor("RED");
        msg.edit(embed.setDescription(`${message.guild.emojiGöster(emojiler.Iptal)} ${uye.toString()} üyesi, taglı belirleme teklifini reddetti!`));
        msg.reactions.removeAll();
      }
    }).catch(() => {
msg.edit(embed.setDescription(`${message.guild.emojiGöster(emojiler.Iptal)} \`30 Saniye\` içerisinde cevap alınamadığından işlem iptal edildi.`))
msg.reactions.removeAll()
 });
  
    }
};