const { Client, Message, MessageEmbed } = require("discord.js");
const Users = require('../../../Database/Schema/Users');
const Upstaffs = require('../../../Database/Schema/Upstaffs');
module.exports = {
    Isim: "yetkibaşlat",
    Komut: ["ytbaşlat","ybaşlat","yetkiliyap"],
    Kullanim: "yetkibaşlat <@sehira/ID>",
    Aciklama: "Belirlenen üyeyi yetkiye davet etmek için istek gönderirsin.",
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
    if(!roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.altYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(cevaplar.noyt);
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if(!uye) return message.channel.send(cevaplar.üye + ` \`${sistem.prefix}${module.exports.Isim} <@sehira/ID>\``);
    if(message.author.id === uye.id) return message.channel.send(cevaplar.kendi).then(x => x.delete({timeout: 5000}));
    if(!uye.user.username.includes(ayarlar.tag)) return message.channel.send(`${cevaplar.prefix} ${uye} isimli üyenin isminde \`${ayarlar.tag}\` sembolü bulunamadığından iptal edildi.`);
    let kontrol = await Users.findOne({id: uye.id})
    if(kontrol && kontrol.Yetkilimi && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(`${cevaplar.prefix} ${uye} isimli üye zaten yetkili olarak belirlenmiş.`);
    if(roller.yönetimRolleri.some(x => uye.roles.cache.has(x)) && roller.üstYönetimRolleri.some(oku => uye.roles.cache.has(oku)) && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send('Hata: Rollerin de yönetim rolü barındığından dolayı işlem iptal edildi!').then(x => x.delete({timeout: 5000}));
    if(uye.roles.cache.has(roller.MinYetkili)) return message.channel.send(`${cevaplar.prefix} \`Belirtilen Üye Yetkili!\``);
    if(message.member.hasPermission('ADMINISTRATOR') || roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) || roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku))) {
      await Users.updateOne({ id: uye.id }, { $set: { "Yetkilimi": true, "Yetkiekleyen": message.member.id } }, { upsert: true }).exec();
      await Users.updateOne({ id: message.member.id }, { $push: { "Yetkililer": { id: uye.id, Tarih: Date.now() } } }, { upsert: true }).exec();
      if(taskConf.sistem && taskConf.yetkiler.some(x => message.member.roles.cache.has(x)) && !message.member.roles.cache.has(taskConf.görevsonyetki)) await message.member.taskAdd("Yetkili", 1).catch(x => {})
      if(coinConf.sistem) await message.member.coinAdd(coinConf.Ödül.Yetkili).catch(x => {})
      message.channel.send(embed.setDescription(`${message.guild.emojiGöster(emojiler.Onay)} ${uye.toString()} üyesi ${message.author} tarafından \`${tarihsel(Date.now())}\` tarihinde başarıyla yetkili olarak başlatıldı!`));
      message.guild.kanalBul("yetki-log").send(embed.setDescription(`${message.author} isimli yetkili ${uye.toString()} isimli kişiyi \`${tarihsel(Date.now())}\` tarihinde yetkiye başlattı!`))
      yetkiBaşlat(uye);
      return;
    }
    embed.setDescription(`${message.member.toString()} isimli yönetici seni yetkili olarak belirlemek istiyor. Kabul ediyor musun?`);
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
        await Users.updateOne({ id: uye.id }, { $set: { "Yetkilimi": true, "Yetkiekleyen": message.member.id } }, { upsert: true }).exec();
        await Users.updateOne({ id: message.member.id }, { $push: { "Yetkililer": { id: uye.id, Tarih: Date.now() } } }, { upsert: true }).exec();
        if(taskConf.sistem && taskConf.yetkiler.some(x => message.member.roles.cache.has(x)) && !message.member.roles.cache.has(taskConf.görevsonyetki)) await message.member.taskAdd("Yetkili", 1).catch(x => {})
        if(coinConf.sistem) await message.member.coinAdd(coinConf.Ödül.Yetkili).catch(x => {})
        msg.edit(embed.setDescription(`${message.guild.emojiGöster(emojiler.Onay)} ${uye.toString()} üyesi ${message.author} tarafından \`${tarihsel(Date.now())}\` tarihinde başarıyla yetkili olarak başlatıldı!`));
        msg.reactions.removeAll();
        message.guild.kanalBul("yetki-log").send(embed.setDescription(`${message.author} isimli yetkili ${uye.toString()} isimli kişiyi \`${tarihsel(Date.now())}\` tarihinde yetkiye başlattı!`))
        yetkiBaşlat(uye);
    } else {
        embed.setColor("RED");
        msg.edit(embed.setDescription(`${message.guild.emojiGöster(emojiler.Iptal)} ${uye.toString()} üyesi, yetkili olma teklifini red etti!`));
        msg.reactions.removeAll();
      }
    }).catch(() => {
msg.edit(embed.setDescription(`${message.guild.emojiGöster(emojiler.Iptal)} \`30 Saniye\` içerisinde cevap alınamadığından işlem iptal edildi.`))
msg.reactions.removeAll()
 });
  
    }
};

async function yetkiBaşlat(user) {
    await Upstaffs.updateOne({ _id: user.id }, { $set: { "staffNo": 1, "staffExNo": 0, "Point": 0, "ToplamPuan": 0, "Baslama": Date.now() } }, {upsert: true}); 
    user.roles.add(roller.abilityHammer).then(x => {
    user.roles.add(roller.MinYetkili)
    })
    };