const { Client, Message} = require("discord.js");
const Punitives = require('../../../Database/Schema/Punitives')
module.exports = {
    Isim: "af",
    Komut: ["toplu-ban-kaldır","bantemizle"],
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
    const bans = await message.guild.fetchBans()
    for (const acar of bans.array()) {
        await message.guild.members.unban(acar.user.id)
        await Punitives.findOne({Uye: acar.user.id, Tip: "Yasaklanma", Aktif: true}).exec(async (err, res) => {
                if(res) await Punitives.updateOne({ No: res.No }, { $set: { "Aktif": false, Bitis: Date.now(), Kaldiran: message.member.id} }, { upsert: true }).exec();
        })
        message.react('✅')
    }

    }
};