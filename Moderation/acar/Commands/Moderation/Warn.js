const { Client, Message, MessageEmbed} = require("discord.js");
const Punitives = require('../../../Database/Schema/Punitives');
const Kullanıcı = require('../../../Database/Schema/Users');
const Stats = require('../../../Database/Schema/Stats');
const Upstaffs = require('../../../Database/Schema/Upstaffs');
const Jail = require('../../../Database/Schema/Jails');
const Taskdata = require('../../../Database/Schema/Managements');
const ms = require('ms');
module.exports = {
    Isim: "uyarı",
    Komut: ["warn"],
    Kullanim: "warn <@sehira/ID>",
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
    let cezano = await Punitives.countDocuments().exec();
    cezano = cezano == 0 ? 1 : cezano + 1;

    let embed = new MessageEmbed().setAuthor(ayarlar.embed.başlık, message.guild.iconURL({dynamic: true})).setColor(ayarlar.embed.renk).setFooter(ayarlar.embed.altbaşlık + ` • Ceza Numarası #${cezano}`)
    if(!roller.warnHammer.some(oku => message.member.roles.cache.has(oku)) && !roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.altYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku))  && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(cevaplar.noyt);
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!uye) return message.channel.send(cevaplar.üye + ` \`${sistem.prefix}${module.exports.Isim} <@sehira/ID> <Sebep>\``);
    if(message.author.id === uye.id) return message.channel.send(cevaplar.kendi);
    if(!uye && message.member.roles.highest.position <= uye.roles.highest.position) return message.channel.send(cevaplar.yetkiust);
    let sebep = args.splice(1).join(" ");
    if(!sebep) return message.channel.send(cevaplar.sebep);
    let lastWarn = await Punitives.find({Uye: uye.id, Tip: "Uyarı"})
    if(lastWarn.length > 4) {
      await Punitives.find({}).exec(async (err, res) => {
        let ceza = new Punitives({ 
            No: cezano,
            Uye: uye.id,
            Yetkili: message.member.id,
            Tip: "Cezalandırılma",
            AtilanSure: "Kalıcı",
            Sebep: "Gereğinden fazla uyarı!",
            Kalkma: Date.now()+ms("365d"),
            Tarih: Date.now()
        })
        let Zamanlama = new Jail({
            No: ceza.No,
            _id: uye.id
        }) 
        Zamanlama.save().catch(e => console.error(e));
        ceza.save().catch(e => console.error(e));
        await Kullanıcı.updateOne({ id: message.member.id } , { $inc: { "Kullanimlar.Jail": 1 } }, { upsert: true }).exec();
    
        message.guild.log(ceza, uye, message.author, "Cezalandırılma", "jail-log")
        if(uye && uye.voice.channel) await uye.voice.kick()
        if(uye && uye.manageable) await uye.rolTanımla(roller.jailRolü).catch(x => client.logger.log("Jail rolü verilemedi lütfen Rol ID'sini kontrol et.", "caution"));
        message.channel.send(`${message.guild.emojiGöster(emojiler.Cezalandırıldı)} ${uye} isimli üye gereğinden fazla uyarısı olduğundan dolayı kalıcı olarak "__Cezalandırılma__" ceza-i işlemi üzerine uygulandı. (Ceza Numarası: \`#${ceza.No}\`)`)
        if(uye) uye.send(embed.setDescription(`${message.author} tarafından \`${sebep}\` sebebi ile uyarı yediğinden dolayı kalıcı olarak "__Cezalandırılma__" ceza-i işlemi üzerine uygulandı.`)).catch(x => {
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

    } else {
    await Punitives.find({}).exec(async (err, res) => {
        let ceza = new Punitives({ 
            No: cezano,
            Uye: uye.id,
            Yetkili: message.member.id,
            Tip: "Uyarı",
            Sebep: sebep,
            Tarih: Date.now()
        })
        
        ceza.save().catch(e => console.error(e))
        await Kullanıcı.updateOne({ id: message.member.id } , { $inc: { "Kullanimlar.Uyarı": 1 } }, { upsert: true }).exec();
        message.guild.log(ceza, uye, message.author, "Uyarılma", "uyarı-log")
        message.channel.send(`${message.guild.emojiGöster(emojiler.Onay)} ${uye} isimli üye \`${sebep}\` nedeni ile uyarıldı. (Ceza Numarası: \`#${ceza.No}\`)`)
        uye.send(embed.setDescription(`${message.author} tarafından \`${sebep}\` sebebi ile **${tarihsel(Date.now())}** tarihinde sunucuda uyarıldın.`)).catch(x => {
        message.channel.send(`${cevaplar.prefix} ${uye} üyesinin özel mesajları kapalı olduğundan dolayı bilgilendirme gönderilemedi.`).then(x => x.delete({timeout: 5000}))
      })
    });
    }
    message.react(emojiler.Onay)

    }
};


