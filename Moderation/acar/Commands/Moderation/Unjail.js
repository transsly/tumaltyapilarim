const { Client, Message, MessageEmbed} = require("discord.js");
const Punitives = require('../../../Database/Schema/Punitives');
const Jail = require('../../../Database/Schema/Jails');
const Users = require('../../../Database/Schema/Users');
module.exports = {
    Isim: "unjail",
    Komut: ["cezalıçıkart", "cezalıçıkart"],
    Kullanim: "unjail <#No/@sehira/ID>",
    Aciklama: "Belirlenen üyeyi cezalıdan çıkartır.",
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
    if(Number(args[0])) {
      let cezanobul = await Jail.findOne({No: args[0]});
      if(cezanobul) args[0] = cezanobul._id
    }
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!uye) return message.channel.send(cevaplar.üye + ` \`${sistem.prefix}${module.exports.Isim} <#No/@sehira/ID>\``);
    if(uye.user.bot) return message.channel.send(cevaplar.bot);
    if(message.author.id === uye.id) return message.channel.send(cevaplar.kendi);
    if(!uye.manageable) return message.channel.send(cevaplar.dokunulmaz);
    if(message.member.roles.highest.position <= uye.roles.highest.position) return message.channel.send(cevaplar.yetkiust);
    let cezakontrol = await Jail.findById(uye.id)
    if(!cezakontrol) {
        message.channel.send(cevaplar.cezayok);
        message.react(emojiler.Iptal)
        return;
    };
    let cezabilgisi = await Punitives.findOne({ Uye: uye.id, Aktif: true, Tip: "Cezalandırılma" })
    if(cezabilgisi && cezabilgisi.Yetkili !== message.author.id && !message.member.hasPermission("ADMINISTRATOR") && !roller.kurucuRolleri.some(x => message.member.roles.cache.has(x))) return message.channel.send(embed.setDescription(`${cezabilgisi.Yetkili ? message.guild.members.cache.get(cezabilgisi.Yetkili) ? `${message.guild.members.cache.get(cezabilgisi.Yetkili)} (\`${cezabilgisi.Yetkili}\`)` : `${cezabilgisi.Yetkili}` :  `${cezabilgisi.Yetkili}`} tarafından cezalandırılmış, senin bu cezalandırmayı açman münkün gözükmüyor.`));
    await Jail.deleteOne({ _id: uye.id })
    await Punitives.updateOne({ No: cezakontrol.No }, { $set: { "Aktif": false, Bitis: Date.now(), Kaldiran: message.member.id} }, { upsert: true }).exec();
        let CID = await Users.findOne({ id: uye.id });
        if(CID) { 
          if(CID.Cinsiyet && CID.Isim && CID.Yas) {
          if(uye && uye.manageable) await uye.setNickname(`${uye.user.username.includes(ayarlar.tag) ? ayarlar.tag : (ayarlar.tagsiz ? ayarlar.tagsiz : (ayarlar.tag || ""))} ${CID.Isim} | ${CID.Yas}`)
          if(!ayarlar.taglıalım || uye.user.username.includes(ayarlar.tag)) {
            if(CID.Cinsiyet == "erkek") await uye.rolTanımla(roller.erkekRolleri)
            if(CID.Cinsiyet == "kadın") await uye.rolTanımla(roller.kadınRolleri)
            if(uye && uye.manageable && uye.user.username.includes(ayarlar.tag)) await uye.roles.add(roller.tagRolü)
          } else {
            if(uye && uye.manageable) await uye.rolTanımla(roller.kayıtsızRolleri).catch(x => client.logger.log("Jail komutunda kayıtsız rolü verilemedi oraya bi göz atmanı öneririm.", "caution"));
          }
        } else {
          await uye.rolTanımla(roller.kayıtsızRolleri).catch(x => client.logger.log("Jail komutunda kayıtsız rolü verilemedi oraya bi göz atmanı öneririm.", "caution"));
          await uye.setNickname(`${uye.user.username.includes(ayarlar.tag) ? ayarlar.tag : (ayarlar.tagsiz ? ayarlar.tagsiz : (ayarlar.tag || ""))} İsim | Yaş`) 
        }} else {
          await uye.rolTanımla(roller.kayıtsızRolleri).catch(x => client.logger.log("Jail komutunda kayıtsız rolü verilemedi oraya bi göz atmanı öneririm.", "caution"));
          await uye.setNickname(`${uye.user.username.includes(ayarlar.tag) ? ayarlar.tag : (ayarlar.tagsiz ? ayarlar.tagsiz : (ayarlar.tag || ""))} İsim | Yaş`) 
        } 

    let channel = message.guild.kanalBul("jail-log")
    if(channel) channel.send(embed.setDescription(`${uye} uyesinin \`#${cezakontrol.No}\` numaralı cezalandırılması, **${tarihsel(Date.now())}** tarihinde ${message.member} tarafından kaldırıldı.`))
    await message.channel.send(`${message.guild.emojiGöster(emojiler.Tag)} ${uye} üyesinin (\`#${cezakontrol.No}\`) ceza numaralı cezalandırılması kaldırıldı!`).then(x => x.delete({timeout: 10500}));;;
    if(uye) uye.send(embed.setDescription(`${message.author} tarafından **${tarihsel(Date.now())}** tarihinde \`#${cezakontrol.No}\` ceza numaralı cezalandırılması kaldırıldı!`)).catch(x => {
      message.channel.send(`${cevaplar.prefix} ${uye} üyesinin özel mesajları kapalı olduğundan dolayı bilgilendirme gönderilemedi.`).then(x => x.delete({timeout: 5000}))
    });
    message.react(emojiler.Onay)
    }
};