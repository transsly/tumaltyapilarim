const {MessageEmbed} = require("discord.js");
const Kullanici = require('../../../Database/Schema/Users')
const Upstaffs = require('../../../Database/Schema/Upstaffs')
const Stats = require('../../../Database/Schema/Stats')
const Taskdata = require('../../../Database/Schema/Managements')
module.exports = {
    Isim: "kayıtsız",
    Komut: ["unregistered","kayitsizyap","kayitsiz"],
    Kullanim: "kayıtsız <@sehira/ID> <Sebep>",
    Aciklama: "Belirlenen üyeyi kayıtsız üye olarak belirler.",
    Kategori: "Register",
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
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.teyitciSorumlusuRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(cevaplar.noyt)
    if(!uye) return message.channel.send(cevaplar.üye + ` \`${sistem.prefix}${module.exports.Isim} <@sehira/ID>\``);
    if(message.author.id === uye.id) return message.channel.send(cevaplar.kendi);
    if(uye.user.bot) return message.channel.send(cevaplar.bot);
    if(!uye.manageable) return message.channel.send(cevaplar.dokunulmaz);
    if(message.member.roles.highest.position <= uye.roles.highest.position) return message.channel.send(cevaplar.yetkiust);
    if(uye.roles.cache.has(roller.kayıtsızRolü)) return message.channel.send(cevaplar.kayıtsız)
    let sebep = args.splice(1).join(" ");
    if(!sebep) return message.channel.send(cevaplar.sebep);
    uye.setNickname(`${uye.user.username.includes(ayarlar.tag) ? ayarlar.tag : (ayarlar.tagsiz ? ayarlar.tagsiz : (ayarlar.tag || ""))} İsim | Yaş`)
    uye.rolTanımla(roller.kayıtsızRolleri)
    if(uye.voice.channel) uye.voice.kick()
    let data = await Kullanici.findOne({id: uye.id});
    if(data) {
      await Kullanici.updateOne({ id: uye.id }, { $push: { "Isimler": { Yetkili: message.member.id, Zaman: Date.now(), Isim: data.Isim, Yas: data.Yas, islembilgi: "Kayıtsıza Atıldı" } } }, { upsert: true }).exec();
      await Kullanici.updateOne({ id: uye.id }, { $set: { "Cinsiyet": "kayıtsız" }}, { upsert: true }).exec();
    };
    if(data && data.Yetkilimi && data.Yetkiekleyen) {
      let Yetkili = await Kullanici.findOne({id: data.Yetkiekleyen }) || {}
    if(Yetkili && Yetkili.Yetkililer) {
          const BabanıSikeyim = message.guild.members.cache.get(data.Yetkiekleyen)
      const findUser = Yetkili.Yetkililer.find(acar => acar.id == uye.id);
      await Kullanici.updateOne({ id: data.Yetkiekleyen }, { $pull: { "Yetkililer": findUser } }, { upsert: true }).exec();
      if(taskConf.sistem && BabanıSikeyim && taskConf.yetkiler.some(x => BabanıSikeyim.roles.cache.has(x)) && !BabanıSikeyim.roles.cache.has(taskConf.görevsonyetki)) await BabanıSikeyim.taskAdd("Yetkili", -1).catch(x => {})
          if(coinConf.sistem && BabanıSikeyim) await BabanıSikeyim.coinAdd(-coinConf.Ödül.Yetkili)
      } 
      await Kullanici.updateOne({ id: uye.id }, { $set: { "Yetkilimi": false, "Yetkiekleyen": new String() } }, { upsert: true }).exec();
   }
   if(uPConf.sistem) await Upstaffs.findByIdAndDelete(uye.id)
   if(taskConf.yetkiler.some(x => uye.roles.cache.has(x)) && !uye.roles.cache.has(taskConf.görevsonyetki)) await Taskdata.findByIdAndDelete(uye.id)
    await Stats.updateOne({ userID: uye.id }, { upstaffVoiceStats: new Map(), upstaffChatStats: new Map() });
    message.guild.kanalBul("kayıtsız-log").send(embed.setDescription(`${uye} isimli üye ${message.author} tarafından **${tarihsel(Date.now())}** tarihinde **${sebep}** nedeniyle kayıtsız üye olarak belirlendi.`))
    message.channel.send(embed.setDescription(`${message.guild.emojiGöster(emojiler.Onay)} ${uye} üyesi, **${sebep}** nedeniyle başarıyla kayıtsız üye olarak belirlendi.`))
    uye.send(embed.setDescription(`${message.author} tarafından \`${sebep}\` sebebi ile **${tarihsel(Date.now())}** tarihinde kayıtsıza atıldın.`)).catch(x => {
      message.channel.send(`${cevaplar.prefix} ${uye} üyesinin özel mesajları kapalı olduğundan dolayı bilgilendirme gönderilemedi.`).then(x => x.delete({timeout: 5000}))
      })
    message.react(emojiler.Onay)
    }
};