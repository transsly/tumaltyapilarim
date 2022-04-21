const Stats = require('../../../Database/Schema/Stats');
const Taskdata = require('../../../Database/Schema/Managements');
const { MessageEmbed, Util } = require("discord.js");
const moment = require('moment');
require('moment-duration-format');
require('moment-timezone');
module.exports = {
    Isim: "puandenetim",
    Komut: ["puandenetim","puan-denetim"],
    Kullanim: "puandenetim <@rol/ID>",
    Aciklama: "Belirlenen role sahip üyelerin tüm ses ve mesaj detaylarını gösterir.",
    Kategori: "Yönetim Sistemi",
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
    if(!taskConf.puanlama.sistem) return;
    if(!roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) &&  !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(cevaplar.noyt); 
    const rol = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);
    if (!rol) return message.channel.send('Hata: `Rolün puanlarını denetleyebilmem için lütfen bir rol etiketle veya IDsini gir.`');
    if (rol.members.size === 0) return message.channel.send('Hata: `Belirtilen rolde üye bulunamadığı için işlem iptal edildi.`');
    message.channel.send(`${rol} Rolündeki yetkililerin yetki puananlamasını çoğunluğa göre sıralıyorum.\n\n`)
    let Mesaj = ``
    let Data = await Taskdata.find()    
    Data.filter(s => message.guild.members.cache.has(s._id) && message.guild.members.cache.get(s._id).roles.cache.has(rol.id)).sort((a, b) => b.Puan - a.Puan).map(async (m, index) => {
            Mesaj += (`────────────────────
 ${index == 0 ? `👑` : `${index+1}.`} ${message.guild.members.cache.get(m._id).toString()} üyesinin yetki puanlaması aşağıda listelenmiştir. 
 Toplam Puanı: \`${m.Puan} Puan\`
 Ses Puanı: \`${m.SesPuan} Puan\`
 Yetkili Puanı: \`${m.YetkiliPuan} Puan\`
 Taglı Puanı: \`${m.TagliPuan} Puan\`
 Davet Puanı: \`${m.InvitePuan} Puan\`
 Kayıt Puanı: \`${m.KayitPuan} Puan\`
 `)
 
        

     })
        if(!Mesaj) return message.channel.send(`${message.guild.emojis.cache.get(emojiler.Iptal)} Puanlama listeleyebileceğim üye bulunamadı.`)
        if(Mesaj) {
        const arr = Util.splitMessage(Mesaj, { maxLength: 2000, char: "\n" });
        for (const newText of arr) {
          message.channel.send(newText);
        }
    } 
  }
};