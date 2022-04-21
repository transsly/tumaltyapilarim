const { MessageEmbed } = require("discord.js");
const Stats = require('../../../Database/Schema/Stats');
const moment = require('moment');
require('moment-duration-format');
require('moment-timezone');
module.exports = {
    Isim: "stat",
    Komut: ["stat","seslerim","mesajlarım"],
    Kullanim: "stat <@sehira/ID>",
    Aciklama: "Belirlenen üye veya kendinizin istatistik bilgilerine bakarsınız",
    Kategori: "Stat",
    Extend: true,
    
   /**
   * @param {Client} client 
   */
  onLoad: function (client) {
    client.sureCevir = (date) => { return moment.duration(date).format('H [saat,] m [dakika,] s [saniye]'); };
  },

   /**
   * @param {Client} client 
   * @param {Message} message 
   * @param {Array<String>} args 
   */
  
  onRequest: async function (client, message, args) { 
    let embed = new MessageEmbed().setFooter(ayarlar.embed.altbaşlık)
    let kullArray = message.content.split(" ");
    let kullaniciId = kullArray.slice(1);
    let uye = message.mentions.members.first() || message.guild.members.cache.get(kullaniciId[0]) || message.guild.members.cache.find(x => x.user.username.toLowerCase() === kullaniciId.slice(0).join(" ") || x.user.username === kullaniciId[0]) || message.member;
      Stats.findOne({ guildID: message.guild.id, userID: uye.id }, (err, data) => {
        if (!data) return message.channel.send("Belirtilen üyenin ses ve mesaj aktifliği bulunamadı.").then(sil => sil.delete({timeout: 5000}));
        let haftalikSesToplam = 0;
        let haftalikSesListe = '';

        if(data.voiceStats) {
          data.voiceStats.forEach(c => haftalikSesToplam += c);
          data.voiceStats.forEach((value, key) => { 
          if(StConf.seskategoriler.find(x => x.id == key)) {
            let kategori = StConf.seskategoriler.find(x => x.id == key);
            let kategoriismi = kategori.isim 
            haftalikSesListe += `\`•\` ${message.guild.channels.cache.has(key) ? kategoriismi ? kategoriismi : `Diğer Odalar` : '#Silinmiş'}: \`${client.sureCevir(value)}\`\n`
           }
          });
        }
        let haftalikChatToplam = 0;
        data.chatStats.forEach(c => haftalikChatToplam += c);
        let haftalikChatListe = '';
        data.chatStats.forEach((value, key) => {
        if(StConf.chatkategoriler.find(x => x.id == key)) {
        let kategori = StConf.chatkategoriler.find(x => x.id == key);
        let mesajkategoriismi = kategori.isim
        haftalikChatListe += `\`•\` ${message.guild.channels.cache.has(key) ? mesajkategoriismi ? mesajkategoriismi : message.guild.channels.cache.get(key).name : '#Silinmiş'}: \`${value}\`\n` 
        }
        });
        message.channel.send(embed
          .setAuthor(uye.user.tag, uye.user.avatarURL({dynamic: true, size: 2048}))
          .setColor(ayarlar.embed.renk)
	  .setThumbnail(uye.user.avatarURL({dynamic: true, size: 2048}))
          .setDescription(`${uye} (${uye.roles.highest}) üyesinin \`${message.guild.name}\` sunucusunda haftalık ses ve mesaj bilgileri aşağıda belirtilmiştir.`)
.addField(`${message.guild.emojis.cache.get(emojiler.Terfi.icon)} Haftalık Sesli Sohbet İstatistiği`,`\`•\` Toplam: \`${client.sureCevir(haftalikSesToplam)}\`
${haftalikSesListe ? haftalikSesListe ? haftalikSesListe : haftalikSesListe : '\`•\` Ses istatistiği bulunamadı.'}`, false)                        
.addField(`${message.guild.emojis.cache.get(emojiler.Terfi.icon)} Haftalık Mesaj İstatistiği`,`\`•\` Toplam: \`${haftalikChatToplam}\`
${haftalikChatListe ? haftalikChatListe ? haftalikChatListe : haftalikChatListe : '\`•\` Mesaj istatistiği bulunamadı.'}`, false)
          );
       });
  }
};