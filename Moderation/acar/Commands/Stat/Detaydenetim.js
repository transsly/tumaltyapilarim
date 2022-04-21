const { MessageEmbed, Util } = require("discord.js");
const Stats = require('../../../Database/Schema/Stats');
const moment = require('moment');
require('moment-duration-format');
require('moment-timezone');
module.exports = {
    Isim: "detaydenetim",
    Komut: ["textdenetim","yazıdenetim"],
    Kullanim: "detaydenetim <@rol/ID>",
    Aciklama: "Belirlenen role sahip üyelerin tüm ses ve mesaj detaylarını gösterir.",
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
    if(!roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku))&& !roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(cevaplar.noyt); 
    const rol = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);
    if (!rol) return message.channel.send('Hata: `İstatistik denetleyebilmem için lütfen bir rol etiketle veya IDsini gir.`');
    if (rol.members.size === 0) return message.channel.send('Hata: `Belirtilen rolde kişi bulunamadığı için işlem iptal edildi.`');
    message.channel.send(`${rol} Rolündeki üyelerin ses, mesaj, yetkili, taglı ve teyit bilgilerini gönderiyorum. Bu işlem biraz zaman alabilir.\n\n`)
    let Mesaj = ``
        let Geneldenetim = await Stats.find({guildID: message.guild.id})
        Geneldenetim = Geneldenetim.filter(s => message.guild.members.cache.has(s.userID) && message.guild.members.cache.get(s.userID).roles.cache.has(rol.id));
          Geneldenetim.sort((uye1, uye2) => {
            let uye2Toplam = 0;
            uye2.voiceStats.forEach((x) => { uye2Toplam += x });
            let uye1Toplam = 0;
            uye1.voiceStats.forEach((x) => { uye1Toplam += x });
            return uye2Toplam-uye1Toplam;
        }).map(async (m, index) => {
            let uyeToplam = 0;
            let haftalikSesListe = '';
            m.voiceStats.forEach((x) => uyeToplam += x );
            m.voiceStats.forEach((value, key) => { 
            if(StConf.seskategoriler.find(x => x.id == key)) {
              let kategori = StConf.seskategoriler.find(x => x.id == key);
              let kategoriismi = kategori.isim 
              if(StConf.tamPuanKategoriler.some(x => x == key)) {
                haftalikSesListe += `\`❯\` **${message.guild.channels.cache.has(key) ? kategoriismi ? kategoriismi : `Diğer Odalar` : '#Silinmiş'}** : \`${client.sureCevir(value)}\`\n`
              } else {
                haftalikSesListe += `\`❯\` ${message.guild.channels.cache.has(key) ? kategoriismi ? kategoriismi : `Diğer Odalar` : '#Silinmiş'}: \`${client.sureCevir(value)}\`\n`
              }
             }
            });
            let haftalikChatToplam = 0;
            let haftalikChatListe = 0
            m.chatStats.forEach(c => haftalikChatToplam += c);
            m.chatStats.forEach((value, key) => { if(key == uPConf.chatKategorisi) haftalikChatListe = value });
            Mesaj += (`────────────────────
 ${index == 0 ? `👑` : `${index+1}.`} ${message.guild.members.cache.get(m.userID).toString()} üyesinin ses verileri **Toplam**: \`${uyeToplam ? client.sureCevir(uyeToplam) : `0 dk`}\` 
${haftalikChatListe ? `\`❯\` ${ayarlar.sunucuIsmi} Chat: \`${haftalikChatListe}\` (toplam: \`${haftalikChatToplam}\`)` : ''}
${haftalikSesListe ? `\n${haftalikSesListe}` : '`❯` Üyenin ses bilgisine ulaşılamadı.\n'}`)
        

     })
        if(!Mesaj) return message.channel.send(`${message.guild.emojis.cache.get(emojiler.Iptal)} Maalesef belirtilen rol de aktiflik yapmış üye bulamadım üzgünüm.`)
        if(Mesaj) {
        const arr = Util.splitMessage(Mesaj, { maxLength: 2000, char: "\n" });
        for (const newText of arr) {
          message.channel.send(newText);
        }
    } 
  }
};