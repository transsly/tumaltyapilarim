const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
    Isim: "emojiyükle",
    Komut: ["emojioluştur", "emojiekle", "emekle", "emyükle"],
    Kullanim: "",
    Aciklama: "",
    Kategori: "-",
    Extend: true,
    
   /**
   * @param {Client} client 
   */
  onLoad: function (client) {

  },

   /**
   * @param {Client} client 
   * @param {Message} msg 
   * @param {Array<String>} args 
   */

  onRequest: async function (client, msg, args) {
    if(!sistem.staff.find(x => x.id == msg.member.id) && !msg.member.hasPermission('ADMINISTRATOR') && !roller.kurucuRolleri.some(oku => msg.member.roles.cache.has(oku))) return;
    const hasEmoteRegex = /<a?:.+:\d+>/gm
    const emoteRegex = /<:.+:(\d+)>/gm
    const animatedEmoteRegex = /<a:.+:(\d+)>/gm
    const isim = `${ayarlar.sunucuIsmi}_${Math.round((Math.random()*9999))}`
    const message = msg.content.match(hasEmoteRegex)
      if (emoji = emoteRegex.exec(message)) return EmojiYükle("https://cdn.discordapp.com/emojis/" + emoji[1] + ".png?v=1", isim, msg)
      else 
      if (emoji = animatedEmoteRegex.exec(message)) return EmojiYükle("https://cdn.discordapp.com/emojis/" + emoji[1] + ".gif?v=1", isim, msg)
      else {
        let [link, ad] = args.slice(0).join(" ").split(" ");
        if (!link) return msg.channel.send(`${msg.guild.emojis.cache.get(emojiler.Iptal)} __Hata__: Lütfen bir bağlantı belirtmelisin! __Örn:__ \`${sistem.prefix}${module.exports.Isim} <Bağlantı> <Emoji Ismi>\``).then(x => x.delete({timeout: 3000}));
        if (!ad) return msg.channel.send(`${msg.guild.emojis.cache.get(emojiler.Iptal)} __Hata__: Lütfen bir emoji ismi belirtmelisin! __Örn:__ \`${sistem.prefix}${module.exports.Isim} <Bağlantı> <Emoji Ismi>\``).then(x => x.delete({timeout: 3000}));
        EmojiYükle(link, ad, msg)
      }
    }
};

function EmojiYükle(link, ad, message) {
  message.guild.emojis.create(link, ad)
  .then(emoji => message.channel.send(`${message.guild.emojiGöster(emojiler.Onay)} Başarıyla \`${emoji.name}\` adında emoji oluşturuldu. (${emoji})`).then(a => a.delete({timeout: 5000})))
  .catch(console.error);
}