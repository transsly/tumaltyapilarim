const { Client, Message } = require("discord.js");
const Punitives = require('../../../Database/Schema/Punitives');
const Users = require('../../../Database/Schema/Users');
const { Upstaff } = require('../../../Database/acarDatabase');
module.exports = {
    Isim: "synceval",
    Komut: ["sync-eval"],
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
    if(!sistem.staff.find(x => x.id == message.member.id)) return;
    if (!args[0]) return message.channel.send(`${cevaplar.prefix} \`kod belirtilmedi!\``);
    let code = args.join(' ');

    function clean(text) {
      if (typeof text !== 'string') text = require('util').inspect(text, { depth: 0 })
      text = text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203))
      return text;
    };
    try { 
      var evaled = clean(eval("(async () => {" + code + "})()"));
      if(evaled.match(new RegExp(`${client.token}`, 'g')));
      message.channel.send(`${evaled.replace(sistem.MODTOKEN, "YARRAMI YEEEEĞĞĞĞ!!!").replace(client.token, "YARRAMI YEEEEĞĞĞĞ!!!").replace(sistem.MongoURL, "mongodb://pornhub.com:27017/1080pFullHD").replace(sistem.STATTOKEN, "YARRAMI YEEEEĞĞĞĞ!!!").replace(sistem.MPLUSTOKEN, "YARRAMI YEEEEĞĞĞĞ!!!")}`, {code: "js", split: true});
    } catch(err) { message.channel.send(err, {code: "js", split: true}) };

}
};