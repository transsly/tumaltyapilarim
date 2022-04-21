const { Client, Message} = require("discord.js");

module.exports = {
    Isim: "emojilistele",
    Komut: ["emojiid", "emojiler"],
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
   * @param {Message} message 
   * @param {Array<String>} args 
   */

  onRequest: async function (client, message, args) {
    if(!sistem.staff.find(x => x.id == message.member.id) && !message.member.hasPermission('ADMINISTRATOR') && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku))) return;
    try {
        message.channel.send(`${message.guild.emojis.cache.map(emoji => `(${emoji.id}) ${emoji.toString()}`).join('\n')}`, {code: 'xl', split: true})
      } catch (err) { };
      return
    }
};