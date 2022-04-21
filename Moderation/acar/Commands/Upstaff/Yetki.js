const Users = require('../../../Database/Schema/Users');
const Stats = require('../../../Database/Schema/Stats');
const Invites = require('../../../Database/Schema/Invites');
const Tasks = require('../../../Database/Schema/Managements');
const Upstaff = require('../../../Database/Schema/Upstaffs');
const { Client, Message, MessageEmbed } = require("discord.js");
const { MessageButton } = require('discord-buttons');
module.exports = {
    Isim: "yetki",
    Komut: ["yetkilianaliz","upstaff","staff"],
    Kullanim: "yetki <@sehira/ID>",
    Aciklama: "Belirlenen yetkilinin sunucu içerisinde ki bilgileri gösterir ve yükseltir düşürür.",
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
    let embed = new MessageEmbed().setAuthor(ayarlar.embed.başlık, message.guild.iconURL({dynamic: true})).setColor(ayarlar.embed.renk)
    if(!roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(cevaplar.noyt);
    let kullanıcı = message.mentions.users.first() || message.guild.members.cache.get(args[0]) || await client.getUser(args[0]) || (args.length > 0 ? client.users.cache.filter(e => e.username.toLowerCase().includes(args.join(" ").toLowerCase())).first(): message.author) || message.author;
    let uye = message.guild.member(kullanıcı);
    if (!uye) return message.channel.send(cevaplar.üyeyok);
    let userData = await Users.findOne({id: uye.id}) 
    let taglıUser = await userData ? userData.Taglılar ? `${userData.Taglılar.length} üye` || `Veri bulunamadı.` : `Veri bulunamadı.` : `Veri bulunamadı.`
    let teyitUser = await userData ? userData.Teyitler ? `${userData.Teyitler.length} üye` || `Veri bulunamadı.` : `Veri bulunamadı.` : `Veri bulunamadı.`
    let yetkiliUser = await userData ? userData.Yetkililer ? `${userData.Yetkililer.length} üye` || `Veri bulunamadı.` : `Veri bulunamadı.` : `Veri bulunamadı.`
    let davetUser = await Invites.findOne({userID: uye.id}) || { regular: 0, bonus: 0, fake: 0 };
    let Upstaffs = await Upstaff.findOne({_id: uye.id}).exec()

    await Stats.findOne({ guildID: message.guild.id, userID: uye.id }, async (err, data) => {
          let haftalikSesToplam = 0;
          let haftalikSesListe = '';
          let haftalikChatToplam = 0;
          let haftalikChatListe = '';
  if(data) {
    if(data.voiceStats) {
      data.voiceStats.forEach(c => haftalikSesToplam += c);
      data.upstaffVoiceStats.forEach((value, key) => { 
      if(StConf.seskategoriler.find(x => x.id == key)) {
        let kategori = StConf.seskategoriler.find(x => x.id == key);
        let kategoriismi = kategori.isim 
        haftalikSesListe += `\`•\` ${message.guild.channels.cache.has(key) ? kategoriismi ? kategoriismi : `Diğer Odalar` : '#Silinmiş'}: \`${client.sureCevir(value)}\`\n`
       }
      });
    }
    data.chatStats.forEach(c => haftalikChatToplam += c);
    data.upstaffChatStats.forEach((value, key) => {
            if(key == uPConf.chatKategorisi) haftalikChatListe = `\`•\` ${message.guild.channels.cache.has(key) ? `${ayarlar.sunucuIsmi} Chat` ? `${ayarlar.sunucuIsmi} Chat` : message.guild.channels.cache.get(key).name : '#Silinmiş'}: \`${value} mesaj\``
    });
  
  }
if(!Upstaffs) return message.channel.send(`${cevaplar.prefix} \`Belirtilen Üye Yetkili Sisteminde Bulunamadı!\` yetki başlatma işleminden sonra tekrar deneyin.`).then(x => x.delete({timeout: 7500}))
    var button_1 = new MessageButton().setID("ykslt").setLabel("⬆️ Yükselt").setStyle("green");
    var button_2 = new MessageButton().setID("dsr").setLabel("⬇️ Düşür").setStyle("gray");
    var button_3 = new MessageButton().setID("buttoniptal").setLabel("İptal").setEmoji(emojiler.Iptal, true).setStyle("red");
    
    let msg = await message.channel.send(embed.setDescription(`${uye} (\`${uye.id}\`) adlı üyenin yetkili verileri.\n
    ${userData ? userData.Yetkiekleyen ? `\`❯\` Sorumlusu: ${message.guild.members.cache.get(userData.Yetkiekleyen)}` : `\`❯\` Sorumlusu: \`Belirlenmedi.\`` : `\`❯\` Sorumlusu: \`Belirlenmedi.\``}
    ${Upstaffs ? Upstaffs.Baslama ? `\`❯\` Yetkiye Başlama Tarihi: \`${tarihsel(Upstaffs.Baslama)}\`` : `\`❯\` Yetkiye Başlama Tarihi: \`Belirlenemedi.\``: `\`❯\` Yetkiye Başlama Tarihi: \`Belirlenemedi.\``}
    ${uye.roles.hoist ? `\`❯\` Şuan ki Yetkisi: ${uye.roles.hoist}` : `` }
    
    \`❯\` Toplam Kayıt Bilgileri: \`${teyitUser}\`
    \`❯\` Toplam Taglı Bilgileri: \`${taglıUser}\`
    \`❯\` Toplam Davet Bilgileri: \`${davetUser.regular == 0 ? `Veri bulunamadı.` : `${davetUser.regular} üye`}\`
    \`❯\` Toplam Yetkili Bilgileri: \`${yetkiliUser}\`
    
    \`❯\` **Ses Bilgileri** (toplam: \`${client.sureCevir(haftalikSesToplam)}\`)
    ${haftalikSesListe ? haftalikSesListe : `\`•\` Listelenecek veri bulunamadı.`}
    \`❯\` **Mesaj Bilgileri** (toplam: \`${haftalikChatToplam}\`)
    ${haftalikChatListe ? haftalikChatListe : `\`•\` Listelenecek veri bulunamadı.`}
    
    **NOT:** Aşağıda ki düğmelerden yetki yükseltimi ve düşürme işlemlerini kolay bir şekilde yapabilirsiniz.
    `), { buttons : [ button_1, button_2, button_3 ]})
    var filter = (button) => button.clicker.user.id === message.member.id;
    let collector = await msg.createButtonCollector(filter, { time: 60000 })

    collector.on("collect", async (button) => {
      if(button.id === "ykslt") {
        msg.delete().catch(err => {})
        let yetkiBilgisi = uPConf.yetkipuan[uPConf.yetkipuan.indexOf(uPConf.yetkipuan.find(x => uye.roles.cache.has(x.rol)))] || uPConf.yetkipuan[uPConf.yetkipuan.length-1];
        let YeniRol = uPConf.yetkipuan[uPConf.yetkipuan.indexOf(yetkiBilgisi)+1];
        await button.reply.think(true)
        if(!YeniRol) return await button.reply.edit(`${cevaplar.prefix} \`Belirtilen Üye En Son Yetki de!\` belirtilen üye en son yetkiye ulaştığı için daha fazla yükseltme işlemi yapılamaz.`).then(x => {message.react(emojiler.Iptal)})
        if(yetkiBilgisi && YeniRol) uye.roles.remove(yetkiBilgisi.rol)
        if(YeniRol) await uye.roles.add(YeniRol.rol)
	await Upstaff.updateOne({ _id: uye.id }, { $set: { "Point": 0, "staffNo": Upstaffs.staffNo += 1, "staffExNo": Upstaffs.staffNo -= 1, "Invite": 0,  "Tag": 0, "Register": 0, "Ses": new Map(), "Mesaj": 0, "Bonus": 0 }}, {upsert: true});
        message.guild.kanalBul("senk-log").send(`:tada: ${uye.toString()} üyesi ${message.member.toString()} tarafından \`${message.guild.roles.cache.get(YeniRol.rol).name}\` isimli yetki rolüne yükseltildi!`);
        await Stats.updateOne({ userID: uye.id }, { upstaffVoiceStats: new Map(), upstaffChatStats: new Map() });
        message.react(emojiler.Onay)
        await button.reply.edit(`${message.guild.emojis.cache.get(emojiler.Onay)} ${uye.toString()} isimli üye başarıyla \`${message.guild.roles.cache.get(YeniRol.rol).name}\` rolüne yükseltildi.`)
      }
      if(button.id === "dsr") {
        msg.delete().catch(err => {})
        let yetkiBilgisi = uPConf.yetkipuan[uPConf.yetkipuan.indexOf(uPConf.yetkipuan.find(x => uye.roles.cache.has(x.rol)))] || uPConf.yetkipuan[uPConf.yetkipuan.length-1];
        let YeniRol = uPConf.yetkipuan[uPConf.yetkipuan.indexOf(yetkiBilgisi)-1];
        await button.reply.think(true)
        if(!YeniRol) return await button.reply.edit(`${cevaplar.prefix} \`Belirtilen Üye En Alt Yetki de!\` belirtilen üye en alt yetki de olduğu için düşürme işlemi yapılamaz.`).then(x => {message.react(emojiler.Iptal)})
        if(YeniRol && uye.roles.cache.has(roller.MinYetkili)) return await button.reply.edit(`${cevaplar.prefix} \`Belirtilen Üye En Alt Yetki de!\` belirtilen üye en alt yetki de olduğu için düşürme işlemi yapılamaz.`).then(x => {message.react(emojiler.Iptal)})
        if(yetkiBilgisi && YeniRol) uye.roles.remove(yetkiBilgisi.rol)
        if(YeniRol) await uye.roles.add(YeniRol.rol)
        message.guild.kanalBul("senk-log").send(`:tada: ${uye.toString()} üyesi ${message.member.toString()} tarafından \`${message.guild.roles.cache.get(YeniRol.rol).name}\` isimli yetki rolüne düşürüldü!`);
        await Stats.updateOne({ userID: uye.id }, { upstaffVoiceStats: new Map(), upstaffChatStats: new Map() });
        await Upstaffs.updateOne({ _id: uye.id }, { $set: { "Point": 0, "staffNo": Upstaffs.staffNo -= 1, "staffExNo": Upstaffs.staffNo -= 1, "Invite": 0,  "Tag": 0, "Register": 0, "Ses": new Map(), "Mesaj": 0, "Bonus": 0 }}, {upsert: true});
        if(Upstaffs.staffNo < 1 && Upstaffs.staffNo < 0) {
          await Upstaffs.updateOne({ _id: uye.id }, { $set: { "Point": 0, "staffNo": 1, "staffExNo": 0, "Invite": 0,  "Tag": 0, "Register": 0, "Ses": new Map(), "Mesaj": 0, "Bonus": 0 }}, {upsert: true});
        }
        message.react(emojiler.Onay)
        await button.reply.edit(`${message.guild.emojis.cache.get(emojiler.Onay)} ${uye.toString()} isimli üye başarıyla \`${message.guild.roles.cache.get(YeniRol.rol).name}\` rolüne düşürüldü.`)
      }
      if(button.id === "buttoniptal") {
          msg.delete().catch(err => {})
      }
    });

    collector.on("end", async () => {
      msg.delete().catch(x => {})
    });
  });
    }
};
