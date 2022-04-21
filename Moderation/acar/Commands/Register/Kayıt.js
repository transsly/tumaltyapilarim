const { Client, Message, MessageEmbed } = require("discord.js");
const { RegisterDB, Upstaff } = require('../../../Database/acarDatabase');
const Punitives = require('../../../Database/Schema/Punitives');
const disbut = require('discord-buttons');
disbut(client)
module.exports = {
    Isim: "kayıt",
    Komut: ["kay","k"],
    Kullanim: "kayıt @sehira/ID <isim> <yaş>",
    Aciklama: "Belirtilen üye sunucuda kayıtsız bir üye ise kayıt etmek için kullanılır.",
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
    if(!roller.teyitciRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.teyitciSorumlusuRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(cevaplar.noyt)
    if(!uye) return message.channel.send(cevaplar.üye + ` \`${sistem.prefix}${module.exports.Isim} <@sehira/ID> <Isim> <Yaş>\``);
    let uyarısıVar = await Punitives.findOne({Uye: uye.id, Tip: "Uyarı"})
    if(message.author.id === uye.id) return message.channel.send(cevaplar.kendi).then(x => x.delete({timeout: 5000}));
    if(uye.user.bot) return message.channel.send(cevaplar.bot);
    if(!uye.manageable) return message.channel.send(cevaplar.dokunulmaz).then(x => x.delete({timeout: 5000}));
    
    if(uye.roles.cache.has(roller.erkekRolü)) return message.channel.send(cevaplar.kayıtlı);
    if(uye.roles.cache.has(roller.kadınRolü)) return message.channel.send(cevaplar.kayıtlı);
    if(message.member.roles.highest.position <= uye.roles.highest.position) return message.channel.send(cevaplar.yetkiust).then(x => x.delete({timeout: 5000}));
    if(ayarlar.taglıalım != false && !uye.user.username.includes(ayarlar.tag) && !uye.roles.cache.has(roller.boosterRolü) && !uye.roles.cache.has(roller.vipRolü) && !message.member.hasPermission('ADMINISTRATOR') && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku))) return message.channel.send(cevaplar.taglıalım).then(x => x.delete({timeout: 5000}));
    if(Date.now()-uye.user.createdTimestamp < 1000*60*60*24*7 && !message.member.hasPermission('ADMINISTRATOR') && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku))) return message.channel.send(cevaplar.yenihesap).then(x => x.delete({timeout: 5000}));
    if(uye.roles.cache.has(roller.şüpheliRolü) && uye.roles.cache.has(roller.jailRolü) && uye.roles.cache.has(roller.yasaklıTagRolü) && !message.member.hasPermission('ADMINISTRATOR') && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku))) return message.channel.send(cevaplar.cezaliüye).then(x => x.delete({timeout: 5000}))    
    args = args.filter(a => a !== "" && a !== " ").splice(1);
    let setName;
    let isim = args.filter(arg => isNaN(arg)).map(arg => arg.charAt(0).replace('i', "İ").toUpperCase()+arg.slice(1)).join(" ");
    let yaş = args.filter(arg => !isNaN(arg))[0] || undefined;
    if (yaş < ayarlar.minYaş) return message.channel.send(cevaplar.yetersizyaş).then(x => x.delete({timeout: 5000}));
    if(!isim || !yaş) return message.channel.send(cevaplar.argümandoldur + ` \`${sistem.prefix}${module.exports.Isim} <@sehira/ID> <Isim> <Yaş>\``);
    setName = `${uye.user.username.includes(ayarlar.tag) ? ayarlar.tag : (ayarlar.tagsiz ? ayarlar.tagsiz : (ayarlar.tag || ""))} ${isim} | ${yaş}`;
    if(uyarısıVar) {
        embed.setDescription(`${uye} (\`${setName}\`) isimli üyenin **__Cezalarını & Uyarılarını__** kontrol ediniz ve daha sonra kayıt işlemini tamamlanabilmesi için, lütfen aşağıda ki düğmelerden cinsiyetini seçiniz.\n\n\`30 Saniye\` içerisinde tepki vermezseniz, işlem otomatik olarak iptal edilir.`)
    } else {
        embed.setDescription(`${uye} (\`${setName}\`) isimli üyenin kayıt işlemini tamamlanabilmesi için, lütfen aşağıda ki düğmelerden cinsiyetini seçiniz.\n\n\`30 Saniye\` içerisinde tepki vermezseniz, işlem otomatik olarak iptal edilir.`)
    }
    
    var button_1 = new disbut.MessageButton().setID("buttonerkek").setLabel("Erkek").setEmoji(emojiler.erkekTepkiID, true).setStyle("gray");
    var button_2 = new disbut.MessageButton().setID("buttonkadın").setLabel("Kadın").setEmoji(emojiler.kadınTepkiID, true).setStyle("gray");
    var button_3 = new disbut.MessageButton().setID("buttoniptal").setLabel("İptal").setEmoji(emojiler.Iptal, true).setStyle("red");

    let msg = await message.channel.send({ buttons : [ button_1, button_2, button_3 ], embed: embed })
    var filter = (button) => button.clicker.user.id === message.member.id;
    let collector = await msg.createButtonCollector(filter, { time: 30000 })
    
    collector.on("collect", async (button) => {
            msg.delete();
            if(button.id === "buttonerkek") {
                uye.setNickname(`${setName}`).catch(err => message.channel.send(cevaplar.isimapi));
                kayıtYap(uye, message.member, isim, yaş, "erkek", message)
                await button.reply.think(true)
                await button.reply.edit(`${message.guild.emojiGöster(emojiler.Onay)} ${uye} adlı üye başarıyla **Erkek** olarak kayıt edildi.`)
            }
            if(button.id === "buttonkadın") {
                uye.setNickname(`${setName}`).catch(err => message.channel.send(cevaplar.isimapi));
                kayıtYap(uye, message.member, isim, yaş, "kadın", message)
                await button.reply.think(true)
                await button.reply.edit(`${message.guild.emojiGöster(emojiler.Onay)} ${uye} adlı üye başarıyla **Kadın** olarak kayıt edildi.`)
            }
            if(button.id === "buttoniptal") {
                message.react(emojiler.Iptal)
                await button.reply.think(true)
                await button.reply.edit(`${message.guild.emojiGöster(emojiler.Iptal)} ${uye} adlı üyenin kayıt işlemi manuel olarak iptal edildi.`)
            }
      });
  
      collector.on("end", async () => {
          msg.delete().catch(x => {})
      });
    }
};

async function kayıtYap(uye, yetkili, isim, yaş, cinsiyet, message) {
    
    let rol;
    let rolver;
    if(cinsiyet === "erkek") {
        rol = roller.erkekRolleri.filter(x => !message.guild.roles.cache.get(x).name.includes('Etkinlik') && !message.guild.roles.cache.get(x).name.includes('Çekiliş')).map(x => message.guild.roles.cache.get(x)).join(", ")
        rolver = roller.erkekRolleri
    } else if(cinsiyet == "kadın") {
        rol = roller.kadınRolleri.filter(x => !message.guild.roles.cache.get(x).name.includes('Etkinlik') && !message.guild.roles.cache.get(x).name.includes('Çekiliş')).map(x => message.guild.roles.cache.get(x)).join(", ")
        rolver = roller.kadınRolleri
    }
    message.react(emojiler.Onay)
    await uye.kayıtRolVer(rolver).then(acar => { if(uye.user.username.includes(ayarlar.tag)) uye.roles.add(roller.tagRolü) });
    await RegisterDB.kayıtBelirt(uye, isim, yaş, yetkili, rol, cinsiyet)
    yetkili.guild.kayıtLog(yetkili, uye, cinsiyet, "kayıt-log");
    let seskanal = yetkili.guild.channels.cache.filter(x => x.parentID == kanallar.publicKategorisi && x.type == "voice").array()
    let chatkanalı = yetkili.guild.channels.cache.get(kanallar.chatKanalı)
    if(uye.user.username.includes(ayarlar.tag)) { chatkanalı.send(`:tada: ${uye} Ailemize Katıldı! ailemize hoş geldin, İyi Eğlenceler.`).then(x => x.delete({timeout: 12500})) } 
    else { 
    chatkanalı.send(`:tada: ${uye} Aramıza Katıldı! sende bizden biri olmak ister misin? ozaman tag almalısın şimdiden, İyi Eğlenceler.`).then(x => x.delete({timeout: 12500})) }
        setTimeout(async () => {
            if(uye && uye.voice.channel && seskanal && uye.manageable) uye.voice.setChannel(seskanal[Math.floor(Math.random() * seskanal.length)].id).catch(err => { client.logger.log("Otomatik Public Kanalına aktarma işleminde odayı bulamadım.", "caution")})
        }, 3000)
    if(uPConf.sistem) await Upstaff.addPoint(yetkili.id, uPConf.odül.kayıt, "Kayıt")
    if(taskConf.sistem && taskConf.yetkiler.some(x => yetkili.roles.cache.has(x)) && !yetkili.roles.cache.has(taskConf.görevsonyetki)) await yetkili.taskAdd("Kayıt", 1).catch(x => {})
    if(coinConf.sistem) await yetkili.coinAdd(coinConf.Ödül.Kayıt).catch(x => {})
}
