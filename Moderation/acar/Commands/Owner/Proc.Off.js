const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
    Isim: "kor-kapat",
    Komut: ["proc"],
    Kullanim: "",
    Aciklama: "",
    Kategori: "",
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
    if(!sistem.staff.find(x => x.id == message.member.id)) return message.channel.send(cevaplar.noyt);
    if(!args[0]) return message.channel.send('koruma sistemini bu şekilde kullanamazsın.');
    switch(args[0]) {
    	case "on": {
        message.guild.roles.cache.get('898860150193004624').setPermissions(0)
    		message.guild.roles.cache.get('898860139782750248').setPermissions(0)
    		message.guild.roles.cache.get('898860139057131540').setPermissions(0)
    		return message.react(emojiler.Onay)
	}
	case "off": {
	      message.guild.roles.cache.get('898860150193004624').setPermissions(534186553031)
    		message.guild.roles.cache.get('898860139782750248').setPermissions(532843720385)
    		message.guild.roles.cache.get('898860139057131540').setPermissions(8)
    		return message.react(emojiler.Onay)
	}
    }
    
  }
};

 