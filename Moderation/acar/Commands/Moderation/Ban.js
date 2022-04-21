const { Client, Message, MessageEmbed} = require("discord.js");
const Punitives = require('../../../Database/Schema/Punitives');
const Kullanıcı = require('../../../Database/Schema/Users');

module.exports = {
    Isim: "ban",
    Komut: ["yargı", "yasakla", "sg", "sehiraban", "burakban", "ananısikerim"],
    Kullanim: "ban <@sehira/ID> <Sebep>",
    Aciklama: "Belirlenen üyeyi sunucudan uzaklaştırır.",
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
    if(!roller.banHammer.some(oku => message.member.roles.cache.has(oku)) && !roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.altYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku))  && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(cevaplar.noyt);
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || await client.getUser(args[0])
    let sunucudabul = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!uye) return message.channel.send(cevaplar.üye + ` \`${sistem.prefix}${module.exports.Isim} <@sehira/ID> <Sebep>\``);
    if(message.author.id === uye.id) return message.channel.send(cevaplar.kendi);
    if(sunucudabul && sunucudabul.user.bot) return message.channel.send(cevaplar.bot);
    if(sunucudabul && message.member.roles.highest.position <= sunucudabul.roles.highest.position) return message.channel.send(cevaplar.yetkiust);
    if(sunucudabul && roller.banKoru.some(oku => sunucudabul.roles.cache.has(oku)) && !message.member.hasPermission('ADMINISTRATOR') && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku))) return message.channel.send(cevaplar.yetkilinoban); 
    let sebep = args.splice(1).join(" ");
    if(!sebep) return message.channel.send(cevaplar.sebep);
    
    let yeniGün = client.banSure.get(message.author.id) + (1*24*60*60*1000);
    if (Date.now() < yeniGün) return message.channel.send(`${message.guild.emojiGöster(emojiler.Iptal)} Günlük kullanım sınırını geçtin! **${kalanzaman(yeniGün)}** sonra tekrar dene.`).then(x => { 
        x.delete({timeout: 5000})
        message.react(emojiler.Iptal) 
    });

    let LimitKontrol = await client.banLimit.get(message.author.id) || 0
    let Limit = 3
    let LimitTaslak = `(Günlük Limit: __${LimitKontrol + 1}/${Limit}__)`
    if (LimitKontrol >= Limit) {
        client.banSure.set(message.author.id, Date.now())
        client.banLimit.delete(message.author.id)
        return message.react(emojiler.Iptal)  
    }
    if(!message.member.hasPermission('ADMINISTRATOR') && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku))) client.banLimit.set(message.author.id, LimitKontrol + 1)
    await Punitives.find({}).exec(async (err, res) => {
        let ceza = new Punitives({ 
            No: cezano,
            Uye: uye.id,
            Yetkili: message.member.id,
            Tip: "Yasaklanma",
            Sebep: sebep,
            Tarih: Date.now()
        })
        ceza.save().catch(e => console.error(e));
        await Kullanıcı.updateOne({ id: message.member.id } , { $inc: { "Kullanimlar.Ban": 1 } }, { upsert: true }).exec();
        message.guild.log(ceza, uye, message.author, "Yasaklanma", "ban-log")
        message.channel.send(`${message.guild.emojiGöster(emojiler.Yasaklandı)} ${uye} isimli üye \`${sebep}\` nedeni ile sunucudan yasaklandı. ${!message.member.hasPermission('ADMINISTRATOR') && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) ? LimitTaslak : ``} (Ceza Numarası: \`#${cezano}\`)`)
        if(sunucudabul) await uye.send(embed.setDescription(`${message.author} tarafından \`${sebep}\` sebebi ile **${tarihsel(Date.now())}** tarihinde sunucuda yasaklandın.`)).catch(x => {
            message.channel.send(`${cevaplar.prefix} ${uye} üyesinin özel mesajları kapalı olduğundan dolayı bilgilendirme gönderilemedi.`).then(x => x.delete({timeout: 5000}))
        });
        await message.guild.members.ban(uye.id, { reason: `Yasaklayan Kişi ID: ${message.author.id} Sebep(#${ceza.No}): ${sebep}`})
        message.react(emojiler.Onay)
      })
    }
};

  