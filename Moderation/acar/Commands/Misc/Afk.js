const { Client, Message, MessageEmbed} = require("discord.js");
const Afks = require('../../../Database/Schema/Afks');
module.exports = {
    Isim: "afk",
    Komut: ["afk"],
    Kullanim: "afk <Sebep>",
    Aciklama: "Klavyeden uzak iseniz gitmeden önce bu komutu girdiğinizde sizi etiketleyenlere sizin klavye başında olmadığınızı açıklar.",
    Kategori: "Misc",
    Extend: false,
    
   /**
   * @param {Client} client 
   */
  onLoad: function (client) {
    client.on("message", async (message) => {
      if(!message.guild || message.author.bot || !message.channel || message.channel.type == "dm") return;
      let GetAfk = await Afks.findById(message.member.id);
      if(message.mentions.users.size >= 1){
        let victim = message.mentions.users.first();
        let victimData = await Afks.findById(victim.id);
        if(victimData) {
          let tarih = tarihHesapla(victimData.sure);
	  if(GetAfk) {
      		await Afks.findByIdAndDelete(message.member.id)
		message.react(emojiler.Iptal)
	  }
          return message.channel.send(`:tada: ${victim} adlı üye \`${victimData.sebep ? `${victimData.sebep}\` sebebiyle ` : ""}${tarih} AFK oldu.`).then(x => x.delete({timeout: 7000}));;
        };
      };
      if(!GetAfk) return;
      await Afks.findByIdAndDelete(message.member.id)
      message.channel.send(`:tada: Tekrardan Hoş Geldin! ${message.author}`).then(x => x.delete({timeout: 7000}));
    });
  },

   /**
   * @param {Client} client
   * @param {Message} message
   * @param {Array<String|Number>} args
   * @returns {Promise<void>}
   */

  onRequest: async function (client, message, args) {
    let GetAfk = await Afks.findById(message.member.id);
    if(GetAfk) return message.channel.send(`${message.guild.emojiGöster(emojiler.Iptal)} AFK durumdayken tekrardan AFK olamazsın ${message.member}!`).then(x => x.delete({timeout: 5000}));;
    let sebep = args.join(' ') || `Şuan da işim var yakın zaman da döneceğim!`;
    await Afks.updateOne({_id: message.member.id}, { $set: { "sure": new Date(), "sebep": sebep } }, {upsert: true}).exec();
    message.react(emojiler.Onay)

    }
};