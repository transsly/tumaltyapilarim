const { Client, Message, MessageEmbed} = require("discord.js");
const Punitives = require('../../../Database/Schema/Punitives');
const Stats = require('../../../Database/Schema/Stats');
const Kullanıcı = require('../../../Database/Schema/Users');
const Upstaffs = require('../../../Database/Schema/Upstaffs');
const Jail = require('../../../Database/Schema/Jails');
const ms = require('ms')

module.exports = {
    Isim: "reklam",
    Komut: ["adsjail", "jailreklam","testkobro"],
    Kullanim: "reklam <@sehira/ID>",
    Aciklama: "Belirlenen üyeyi reklam cezası olarak cezalandırır.",
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
    await Cezalandır(uye, message, "Reklam", "365d", "Kalıcı", embed)
    message.react(emojiler.Onay)
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
  if(!message.member.hasPermission('ADMINISTRATOR')) client.jailLimit.set(message.author.id, LimitKontrol + 1)
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
    }) 
    Zamanlama.save().catch(e => console.error(e));
    ceza.save().catch(e => console.error(e));
    await Kullanıcı.updateOne({ id: message.member.id } , { $inc: { "Kullanimlar.Jail": 1 } }, { upsert: true }).exec();

    message.guild.log(ceza, uye, message.author, "Cezalandırılma", "jail-log")
    if(uye && uye.voice.channel) await uye.voice.kick()
    if(uye && uye.manageable) await uye.rolTanımla(roller.jailRolü).catch(x => client.logger.log("Jail rolü verilemedi lütfen Rol ID'sini kontrol et.", "caution"));
    message.channel.send(`${message.guild.emojis.cache.get(emojiler.Onay)} ${uye} isimli üyeye \`Reklam\` nedeniyle "__Cezalandırılma__" türünde ceza-i işlem uygulandı. ${!message.member.hasPermission('ADMINISTRATOR') ? LimitTaslak : ``} (Ceza Numarası: \`#${ceza.No}\`)`)
    if(uye) uye.send(embed.setDescription(`${message.author} tarafından \`Reklam\` sebebi ile **${tarihsel(Date.now())}** tarihinde sunucuda cezalandırıldın.`)).catch(x => {
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
  await Stats.updateOne({ userID: uye.id }, { upstaffVoiceStats: new Map(), upstaffChatStats: new Map() });
});

  message.react(emojiler.Onay)
}