const { Client, Message, MessageEmbed} = require("discord.js");
const Punitives = require('../../../Database/Schema/Punitives');
const Kullanıcı = require('../../../Database/Schema/Users');
module.exports = {
    Isim: "ceza",
    Komut: ["cezabilgi"],
    Kullanim: "ceza <#Ceza-No>",
    Aciklama: "Belirtilen ceza numarasının bütün bilgilerini gösterir.",
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
    let embed = new MessageEmbed().setAuthor(ayarlar.embed.başlık, message.guild.iconURL({dynamic: true})).setColor(ayarlar.embed.renk)
    if(!Number(args[0])) return message.channel.send(`${cevaplar.prefix} \`Lütfen kontrol edebilmem için bir ceza numarası girmelisiniz.\``)
    await Punitives.findOne({No: args[0]}, async (err, res) => {
        if(!res) return message.channel.send(`${cevaplar.prefix} Belirttiğin \`#${args[0]}\` numaralı ceza bilgisi bulunamadı.`).then(x => x.delete({timeout: 5000}));
        if(err) return message.channel.send('Hata: `Bazı hatalar oluştu :(`').then(x => x.delete({timeout: 5000}));
            // Cezalanan Üye
            let cezalanan = await client.getUser(res.Uye);
            let cezalananbilgi;
            if(cezalanan != `\`Bulunamayan Üye\`` && cezalanan.username) cezalananbilgi = `${cezalanan} (\`${cezalanan.id}\`)`;
            if(!cezalananbilgi) cezalananbilgi = "<@"+res.Cezalanan+">" + `(\`${res.Cezalanan}\`)`
            // Ceza Veren Üye
            let yetkili = await client.getUser(res.Yetkili);
            let yetkilibilgi;
            if(yetkili != `\`Bulunamayan Üye\`` && yetkili.username) yetkilibilgi = `${yetkili} (\`${yetkili.id}\`)`;
            if(!yetkilibilgi) yetkilibilgi = "Bilinmiyor"
            // Manuel Komut İle Kaldırıldıysa
            let kaldırılmadurumu;
            if(!res.Kaldiran) kaldırılmadurumu = `` 
            if(res.Kaldiran) kaldırılmadurumu = "• Ceza'yı Kaldıran: " + `${await client.getUser(res.Kaldiran) ? message.guild.members.cache.get(res.Kaldiran) ? message.guild.members.cache.get(res.Kaldiran) : `<@${res.Kaldiran}> (\`${res.Kaldiran}\`)` : `<@${res.Kaldiran}> (\`${res.Kaldiran}\`)` }`
            message.channel.send(embed.setDescription(`**Ceza Detayı** (\`#${res.No}/${res.Tip}\`)
• Üye Bilgisi: ${cezalanan}
• Yetkili Bilgisi: ${yetkili}
• Ceza Tarihi: \`${tarihsel(res.Tarih)}\`
• Ceza Süresi: \`${res.AtilanSure ? res.AtilanSure : "Kalıcı"}\`
• Ceza Durumu: \`${res.Aktif == true ? "Aktif ✅" : "Aktif Değil ❌"}\`
${kaldırılmadurumu}`).addField(`Ceza Sebepi`,`\`${res.Sebep}\``).setFooter(ayarlar.embed.altbaşlık + ` • Ceza Numarası #${res.No}`))
    })
    }
};