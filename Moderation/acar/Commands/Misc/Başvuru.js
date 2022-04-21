const { Client, Message, MessageEmbed} = require("discord.js");

module.exports = {
    Isim: "başvuru",
    Komut: ["basvuru"],
    Kullanim: "başvuru <Yetki Başvurusu Açıklaması>",
    Aciklama: "",
    Kategori: "Misc",
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
    let platform = {
        web: 'İnternet Tarayıcısı',
        desktop: 'PC (App)',
        mobile: 'Mobil'
      }
    let bilgi;
    let şüphe;
    if(message.member.user.presence.status !== 'offline') { bilgi = `Başvuru Yapılan Cihaz: \`${platform[Object.keys(message.member.user.presence.clientStatus)[0]]}\`` } else { bilgi = 'Bağlandığı Cihaz: `Çevrimdışı`' }
    let embed = new MessageEmbed().setAuthor(ayarlar.embed.başlık, message.guild.iconURL({dynamic: true})).setColor(ayarlar.embed.renk).setFooter(ayarlar.embed.altbaşlık)
    if(!message.member.roles.cache.has(roller.tagRolü) && !message.member.user.username.includes(ayarlar.tag)) return message.channel.send(`Hata: İsminiz de \`${ayarlar.tag}\` sembolü bulunmadığından yetkili başvurusu yapamazsınız!`).then(x => x.delete({timeout: 5000}));
    if(roller.Yetkiler.some(x => message.member.roles.cache.has(x))) return message.channel.send(`Hata: \`Yetkili olduğunuz için başvuru işleminde bulunamazsınız.\``);
    let cezaPuan = await client.cezaPuan(message.member.id) || 0;
    if(cezaPuan >= 25) return message.channel.send(`Hata: \`Ceza Puanı 25 ve üzeri olduğu için yetki başvurun kalıcı olarak sonlandırıldı.\``);
    let açıklama = args.splice(0).join(" ");
    if(!açıklama) return message.channel.send(`Hata: \`Lütfen yetkili başvuru için açıklamanızı yazın.\``);
    if(cezaPuan >= 10) {
        şüphe = `${message.guild.emojiGöster(emojiler.Iptal)} \`Şüpheli!\``
    } else {
        şüphe = `${message.guild.emojiGöster(emojiler.Onay)} \`Geçerli!\``
    }
    message.channel.send(`${message.guild.emojiGöster(emojiler.Onay)} Yetkili başvurunuz üst yetkililere iletildi en kısa zamanda sonuçlanacaktır.`).then(x => {
    x.delete({timeout: 5000})
    message.guild.kanalBul("başvurular").send(embed.setDescription(`${message.author} kişisinin başvuru detayı`).addField(`__**Kullanıcı Bilgisi**__`, `ID: \`${message.author.id}\`
Oluşturulma Tarihi: \`${tarihsel(message.member.createdAt)}\`
Katılım Tarihi: \`${tarihsel(message.member.joinedAt)}\`
${bilgi}
Ceza Puanı Bilgisi: \`${cezaPuan}\` ( ${şüphe} )
Başvuru Tarihi: \`${tarihsel(Date.now())}\`
`).addField(`__**Kullanıcı Açıklaması**__`, `\`${açıklama}\``))
    })
    message.react(emojiler.Onay)
    }
};