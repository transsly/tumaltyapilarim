const { Client, Message, MessageEmbed} = require("discord.js");
const Kullanici = require('../../../Database/Schema/Users');

module.exports = {
    Isim: "isim",
    Komut: ["i","nick"],
    Kullanim: "isim <@sehira/ID> <İsim> <Yaş>",
    Aciklama: "Belirtilen üyenin ismini ve yaşını güncellemek için kullanılır.",
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
    let embed = new MessageEmbed().setAuthor(ayarlar.embed.başlık, message.guild.iconURL({dynamic: true})).setColor(ayarlar.embed.renk)
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!roller.teyitciRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.altYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(cevaplar.noyt)
    if(!uye) return message.channel.send(cevaplar.üye + ` \`${sistem.prefix}${module.exports.Isim} <@sehira/ID> <Isim> <Yaş>\``);
    if(message.author.id === uye.id) return message.channel.send(cevaplar.kendi).then(x => x.delete({timeout: 5000}));
    if(uye.user.bot) return message.channel.send(cevaplar.bot);
    if(!uye.manageable) return message.channel.send(cevaplar.dokunulmaz).then(x => x.delete({timeout: 5000}));
    if(message.member.roles.highest.position <= uye.roles.highest.position) return message.channel.send(cevaplar.yetkiust).then(x => x.delete({timeout: 5000}));
    args = args.filter(a => a !== "" && a !== " ").splice(1);
    let setName;
    let isim = args.filter(arg => isNaN(arg)).map(arg => arg.charAt(0).replace('i', "İ").toUpperCase()+arg.slice(1)).join(" ");
    let yaş = args.filter(arg => !isNaN(arg))[0] || undefined;
    if (yaş < ayarlar.minYaş) return message.channel.send(cevaplar.yetersizyaş).then(x => x.delete({timeout: 5000}));
    if(!isim || !yaş) return message.channel.send(cevaplar.argümandoldur + ` \`${sistem.prefix}${module.exports.Isim} <@sehira/ID> <Isim> <Yaş>\``);
    setName = `${uye.user.username.includes(ayarlar.tag) ? ayarlar.tag : (ayarlar.tagsiz ? ayarlar.tagsiz : (ayarlar.tag || ""))} ${isim} | ${yaş}`;
    uye.setNickname(`${setName}`).catch(err => message.channel.send(cevaplar.isimapi));
    var filter = msj => msj.author.id === message.author.id && msj.author.id !== client.user.id;
    await Kullanici.updateOne({ id: uye.id }, { $set: { "Isim": isim, "Yas": yaş } }, { upsert: true }).exec();
    await Kullanici.updateOne({ id: uye.id }, { $push: { "Isimler": { Yetkili: message.member.id, Zaman: Date.now(), Isim: isim, Yas: yaş, islembilgi: "İsim Güncelleme" } } }, { upsert: true }).exec();
    let isimveri = await Kullanici.findOne({ id: uye.id }) || [];
    let isimler = isimveri.Isimler.length > 0 ? isimveri.Isimler.reverse().map((value, index) => `\`${ayarlar.tag} ${value.Isim} | ${value.Yas}\` (${value.islembilgi}) ${value.Yetkili ? "(<@"+ value.Yetkili + ">)" : ""}`).join("\n") : "";
    message.channel.send(embed
    .setDescription(`${uye} üyesinin ismi başarıyla "${isim} | ${yaş}" olarak değiştirildi, bu üye daha önce bu isimlerle kayıt olmuş.
    \n${message.guild.emojiGöster(emojiler.Iptal)} üyesinin toplamda ${isimveri.Isimler.length} isim kayıtı bulundu
${isimler}\n\nÜyesinin önceki isimlerine \`${sistem.prefix}isimler @sehira/ID\` komutuyla bakarak kayıt işlemini\n gerçekleştirmeniz önerilir.`)
    ).then(x => {
        message.react(emojiler.Onay)
        x.delete({timeout: 15000})
    })

    }
};

