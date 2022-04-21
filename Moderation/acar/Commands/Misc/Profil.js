const { Client, Message, MessageEmbed } = require("discord.js");
const Users = require('../../../Database/Schema/Users');
const Coins = require('../../../Database/Schema/Coins');
const moment = require("moment");
require("moment-duration-format");
module.exports = {
    Isim: "profil",
    Komut: ["me", "info"],
    Kullanim: "profil <@sehira/ID>",
    Aciklama: "Belirlenen kişinin veya kullanan kişinin sunucu içerisindeki detaylarını ve discord içerisindeki bilgilerini aktarır.",
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
  let kullanici = message.mentions.users.first() || client.users.cache.get(args[0]) || (args.length > 0 ? client.users.cache.filter(e => e.username.toLowerCase().includes(args.join(" ").toLowerCase())).first(): message.author) || message.author;
  let uye = message.guild.member(kullanici);
  if(!uye) return message.channel.send(cevaplar.üyeyok);
  if(kullanici.bot) return message.channel.send(`${cevaplar.prefix} \`Kullanıcı BOT\` belirtilen kullanıcı bot olduğu için işlem iptal edildi.`);
  let yetkiliKullanim = await Users.findOne({ id: uye.id })
  let coinBilgisi = await Coins.findOne({ _id: uye.id })
  let cezapuanoku = await client.cezaPuan(uye.id) || 0;
  let platform = { web: '`İnternet Tarayıcısı` `🌍`', desktop: '`PC (App)` `💻`', mobile: '`Mobil` `📱`' }
  let bilgi;
  let uyesesdurum;
  let yetkiliDurum;
  let filterRozetler;
  if(coinBilgisi) {
    if(coinBilgisi.Envanter) {
      let rozetler = coinBilgisi.Envanter.filter(x => x.UrunTuru == "Rozet").sort((a, b) => b.Tarih - a.Tarih)
      rozetler.length > 12 ? rozetler.length = 12 : rozetler.length = rozetler.length
      filterRozetler = rozetler.map(x => `${x.UrunEmoji ? message.guild.emojis.cache.get(x.UrunEmoji) ? message.guild.emojis.cache.get(x.UrunEmoji) : message.guild.emojis.cache.get(emojiler.Tag)  : "EM-NO"}`).join(' ')
 
    }
  }
  if(uye.user.presence.status !== 'offline') { bilgi = `\`•\` Bağlandığı Cihaz: ${platform[Object.keys(uye.user.presence.clientStatus)[0]]}` } else { bilgi = '`•` Bağlandığı Cihaz: Çevrimdışı `🔻`' }
  const embed = new MessageEmbed().setColor(ayarlar.embed.renk).setFooter(ayarlar.embed.altbaşlık).setAuthor(kullanici.tag.replace("`", ""), kullanici.avatarURL({dynamic: true, size: 2048})).setThumbnail(kullanici.avatarURL({dynamic: true, size: 2048}))
  .addField(`${message.guild.emojiGöster(emojiler.uyeEmojiID)} **Kullanıcı Bilgisi**`, 
  `\`•\` Rozetler: ${filterRozetler ? filterRozetler : "`Rozet bulunamadı.`"}
  \`•\` ID: \`${kullanici.id}\`
  \`•\` Profil: ${kullanici}
  \`•\` Oluşturulma Tarihi: \`${tarihsel(kullanici.createdAt)}\`
  ${bilgi}
  \`•\` Ceza Puanı: \`${cezapuanoku}\`
  \`•\` Katılma Tarihi: \`${tarihsel(uye.joinedAt)}\`
  \`•\` Katılım Sırası: \`${(message.guild.members.cache.filter(a => a.joinedTimestamp <=uye.joinedTimestamp).size).toLocaleString()}/${(message.guild.memberCount).toLocaleString()}\`
  \`•\` Rolleri (\`${uye.roles.cache.size}\`): ${uye.roles.cache.filter(x => x.name !== "@everyone").map(x => x).join(', ')}
  ${coinBilgisi ? coinBilgisi.Bio ? ` \`•\` Biyografi: \`${coinBilgisi.Bio}\`` : "" : ""}`)
  if(await uye.voice.channel) {
    uyesesdurum = `\`•\` Bulunduğu Kanal: \`#${uye.voice.channel.name}\``
    uyesesdurum += `\n\`•\` Mikrofon Durumu: \`${uye.voice.selfMute ? '❌' : '✅'}\``
    uyesesdurum += `\n\`•\` Kulaklık Durumu: \`${uye.voice.selfDeaf ? '❌' : '✅'}\``
    if(uye.voice.selfVideo) uyesesdurum += `\n\`•\` Kamera Durumu: \`✅\``
    if(uye.voice.streaming) uyesesdurum += `\n\`•\` Yayın Durumu: \`✅\``
    embed.addField(`${message.guild.emojiGöster(emojiler.Terfi.icon)} __**Sesli Kanal Bilgisi**__`, uyesesdurum);
  }
if(roller.Yetkiler.some(x => uye.roles.cache.has(x)) || roller.kurucuRolleri.some(oku => uye.roles.cache.has(oku)) || uye.hasPermission('ADMINISTRATOR')) {
  if(yetkiliKullanim && yetkiliKullanim.Kullanimlar) {
    let uyari = yetkiliKullanim.Kullanimlar.Uyarı || 0
    let chatMute = yetkiliKullanim.Kullanimlar.Mute || 0
    let sesMute = yetkiliKullanim.Kullanimlar.Sesmute || 0
    let Kick = yetkiliKullanim.Kullanimlar.Kick || 0
    let ban = yetkiliKullanim.Kullanimlar.Ban || 0
    let jail = yetkiliKullanim.Kullanimlar.Jail || 0
    let toplam = uyari+chatMute+sesMute+Kick+ban+jail;
    yetkiliDurum = `toplam \`${toplam}\` yetki komutu kullanmış.\n(**${uyari}** uyarma, **${chatMute}** chat mute, **${sesMute}** ses mute, **${jail}** jail)\n(**${Kick}** atma, **${ban}** yasaklama)`;
    embed.addField(`${message.guild.emojiGöster(emojiler.Terfi.icon)} **Yetki Kullanım Bilgisi**`, yetkiliDurum);
  }
}
if(coinBilgisi) {
  if(coinBilgisi.Transferler) {
  let transfer = coinBilgisi.Transferler.sort((a, b) => b.Tarih - a.Tarih)
  transfer.length > 5 ? transfer.length = 5 : transfer.length = transfer.length
  filterTransfer = transfer.map(x => `\`${x.Islem == "Gönderilen" ? "💱" : "💸"}\` ${x.Uye ? message.guild.members.cache.get(x.Uye) ? message.guild.members.cache.get(x.Uye) : `<@${x.Uye}>` : `<@${x.Uye}>` }  \`${x.Tutar} 💴\` (\`${tarihsel(x.Tarih)}\`)`)
  embed.addField(`${message.guild.emojiGöster(emojiler.Terfi.icon)} **Son 5 Coin Transferi**`, filterTransfer);
  }
}
message.channel.send(embed);



    }
};