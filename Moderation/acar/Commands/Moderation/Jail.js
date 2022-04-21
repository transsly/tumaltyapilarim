const { Client, Message, MessageEmbed} = require("discord.js");
const Punitives = require('../../../Database/Schema/Punitives');
const Stats = require('../../../Database/Schema/Stats');
const Kullanıcı = require('../../../Database/Schema/Users');
const Upstaffs = require('../../../Database/Schema/Upstaffs');
const Jail = require('../../../Database/Schema/Jails');
const Taskdata = require('../../../Database/Schema/Managements');
const ms = require('ms')

module.exports = {
    Isim: "jail",
    Komut: ["tempjail", "cezalı","testkobro"],
    Kullanim: "jail <@sehira/ID>",
    Aciklama: "Belirlenen üyeyi ceza şeklinde uyarır ve cezalarına işler.",
    Kategori: "Moderation",
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
    if(!roller.jailHammer.some(oku => message.member.roles.cache.has(oku)) && !roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.altYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku))  && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(cevaplar.noyt);
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!uye) return message.channel.send(cevaplar.üye + ` \`${sistem.prefix}${module.exports.Isim} <@sehira/ID>\``);
    if(uye.user.bot) return message.channel.send(cevaplar.bot);
    if(message.author.id === uye.id) return message.channel.send(cevaplar.kendi);
    if(!uye.manageable) return message.channel.send(cevaplar.dokunulmaz);
    if(message.member.roles.highest.position <= uye.roles.highest.position) return message.channel.send(cevaplar.yetkiust);
    let cezakontrol = await Jail.findById(uye.id)
    if(cezakontrol) {
        message.channel.send(cevaplar.cezavar);
        message.react(emojiler.Iptal)
        return;
    }
    let sebepcek = require('../../Settings/_reasons.json').jail;
    let sebeplistele = await message.channel.send(embed.setDescription(`${message.guild.emojiGöster(emojiler.Cezalandırıldı)} ${uye} isimli üyesini hangi sebep ile **cezalandırmak** istiyorsun?\n\n${sebepcek.map((value, index) => `\`${value.emoji} ${value.sebep}\``).join("\n")}`)).then(async m => {
      await m.react(sebepcek[0].emoji)
      await m.react(sebepcek[1].emoji)
      await m.react(sebepcek[2].emoji)
      await m.react(sebepcek[3].emoji)
      await m.react(sebepcek[4].emoji)
      await m.react(sebepcek[5].emoji)
      await m.react(sebepcek[6].emoji)
      return m; }).catch(x => undefined);
      let tepki = await sebeplistele.awaitReactions((reaction, user) => user.id == message.author.id, { errors: ["time"], max: 1, time: 30000 }).then(coll => coll.first()).catch(err => { message.channel.send(embed.setDescription(`${message.author}, \`30 saniye\` boyunca cevap vermediği için ceza-i işlem iptal edildi.`)).then(sil => sil.delete({timeout: 7500})); sebeplistele.delete().catch(); return; });
      if(!tepki) return;
        sebeplistele.delete()
      if (tepki.emoji.name == sebepcek[0].emoji) {
        await Cezalandır(uye, message, sebepcek[0].sebep, sebepcek[0].suresi, sebepcek[0].zaman, embed)
      }if (tepki.emoji.name == sebepcek[1].emoji) {
        await Cezalandır(uye, message, sebepcek[1].sebep, sebepcek[1].suresi, sebepcek[1].zaman, embed)
      }if (tepki.emoji.name == sebepcek[2].emoji) {
        await Cezalandır(uye, message, sebepcek[2].sebep, sebepcek[2].suresi, sebepcek[2].zaman, embed)
      }if (tepki.emoji.name == sebepcek[3].emoji) {
        await Cezalandır(uye, message, sebepcek[3].sebep, sebepcek[3].suresi, sebepcek[3].zaman, embed)
      }if (tepki.emoji.name == sebepcek[4].emoji) {
        await Cezalandır(uye, message, sebepcek[4].sebep, sebepcek[4].suresi, sebepcek[4].zaman, embed)
      }if (tepki.emoji.name == sebepcek[5].emoji) {
        await Cezalandır(uye, message, sebepcek[5].sebep, sebepcek[5].suresi, sebepcek[5].zaman, embed)
      }if (tepki.emoji.name == sebepcek[6].emoji) {
        await Cezalandır(uye, message, sebepcek[6].sebep, sebepcek[6].suresi, sebepcek[6].zaman, embed)
      }
    }
};

async function Cezalandır(uye, message, sebep, sure, jailzaman, embed) {
  let yeniGün = client.jailSure.get(message.author.id) + (1*24*60*60*1000);
  if (Date.now() < yeniGün) return message.channel.send(`${message.guild.emojiGöster(emojiler.Iptal)} Günlük kullanım sınırını geçtin! **${kalanzaman(yeniGün)}** sonra tekrar dene.`).then(x => { 
      x.delete({timeout: 5000})
      message.react(emojiler.Iptal) 
  });

  let LimitKontrol = await client.jailLimit.get(message.author.id) || 0
  let Limit = 5
  let LimitTaslak = `(Günlük Limit: __${LimitKontrol + 1}/${Limit}__)`
  if (LimitKontrol >= Limit) {
      client.jailSure.set(message.author.id, Date.now())
      client.jailLimit.delete(message.author.id)
      return message.react(emojiler.Iptal)  
  }
  if(!message.member.hasPermission('ADMINISTRATOR') && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku))) client.jailLimit.set(message.author.id, LimitKontrol + 1)
  let cezano = await Punitives.countDocuments().exec();
  cezano = cezano == 0 ? 1 : cezano + 1;
  await Punitives.find({}).exec(async (err, res) => {
    let ceza = new Punitives({ 
        No: cezano,
        Uye: uye.id,
        Yetkili: message.member.id,
        Tip: "Cezalandırılma",
        AtilanSure: jailzaman,
        Sebep: sebep,
        Kalkma: Date.now()+ms(sure),
        Tarih: Date.now()
    })
    let Zamanlama = new Jail({
        No: ceza.No,
        _id: uye.id,
        Kalkma: Date.now()+ms(sure)
    }) 
    Zamanlama.save().catch(e => console.error(e));
    ceza.save().catch(e => console.error(e));
    await Kullanıcı.updateOne({ id: message.member.id } , { $inc: { "Kullanimlar.Jail": 1 } }, { upsert: true }).exec();

    message.guild.log(ceza, uye, message.author, "Cezalandırılma", "jail-log")
    if(uye && uye.voice.channel) await uye.voice.kick()
    if(uye && uye.manageable) await uye.rolTanımla(roller.jailRolü).catch(x => client.logger.log("Jail rolü verilemedi lütfen Rol ID'sini kontrol et.", "caution"));
    message.channel.send(`${message.guild.emojiGöster(emojiler.Cezalandırıldı)} ${uye} isimli üyeye \`${sebep}\` nedeniyle "__Cezalandırılma__" türünde \`${jailzaman}\` boyunca ceza-i işlem uygulandı. ${!message.member.hasPermission('ADMINISTRATOR') && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) ? LimitTaslak : ``} (Ceza Numarası: \`#${ceza.No}\`)`)
    if(uye) uye.send(embed.setDescription(`${message.author} tarafından \`${sebep}\` sebebi ile **${tarihsel(Date.now())}** tarihinde \`${jailzaman}\` süresince sunucuda cezalandırıldın.`)).catch(x => {
      message.channel.send(`${cevaplar.prefix} ${uye} üyesinin özel mesajları kapalı olduğundan dolayı bilgilendirme gönderilemedi.`).then(x => x.delete({timeout: 5000}))
  })

  let data = await Kullanıcı.findOne({id: uye.id});
  if(data && data.Yetkilimi && data.Yetkiekleyen) {
    let Yetkili = await Kullanıcı.findOne({id: data.Yetkiekleyen }) || {}
  if(Yetkili && Yetkili.Yetkililer) {
        const BabanıSikeyim = message.guild.members.cache.get(data.Yetkiekleyen)
    const findUser = Yetkili.Yetkililer.find(acar => acar.id == uye.id);
    await Kullanıcı.updateOne({ id: data.Yetkiekleyen }, { $pull: { "Yetkililer": findUser } }, { upsert: true }).exec();
    if(taskConf.sistem && BabanıSikeyim && taskConf.yetkiler.some(x => BabanıSikeyim.roles.cache.has(x)) && !BabanıSikeyim.roles.cache.has(taskConf.görevsonyetki)) await BabanıSikeyim.taskAdd("Yetkili", -1).catch(x => {})
        if(coinConf.sistem && BabanıSikeyim) await BabanıSikeyim.coinAdd(-coinConf.Ödül.Yetkili)
    } 
    await Kullanıcı.updateOne({ id: uye.id }, { $set: { "Yetkilimi": false, "Yetkiekleyen": new String() } }, { upsert: true }).exec();
 }

  if(uPConf.sistem) await Upstaffs.findByIdAndDelete(uye.id)
  if(taskConf.sistem && taskConf.yetkiler.some(x => uye.roles.cache.has(x)) && !uye.roles.cache.has(taskConf.görevsonyetki)) await Taskdata.findByIdAndDelete(uye.id)
  await Stats.updateOne({ userID: uye.id }, { upstaffVoiceStats: new Map(), upstaffChatStats: new Map() });
});

  message.react(emojiler.Onay)
}