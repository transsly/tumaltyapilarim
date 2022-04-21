const { Client, Message} = require("discord.js");

module.exports = {
    Isim: "emojikur",
    Komut: ["emkur"],
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
    const emojis = [

            // Penal & Require
        { name: "Onay", url: "https://cdn.discordapp.com/emojis/817508162231205919.gif" },
        { name: "Iptal", url: "https://cdn.discordapp.com/emojis/817508163103227904.gif" },
        { name: "HosGif", url: "https://cdn.discordapp.com/emojis/817338914913910825.gif" },
        { name: "Tag", url: "https://cdn.discordapp.com/emojis/817508161895792670.gif" },
        { name: "Yasaklandi", url: "https://cdn.discordapp.com/emojis/817508162454159382.gif" },
        { name: "Susturuldu", url: "https://cdn.discordapp.com/emojis/817508161480032316.png" },
        { name: "Cezalandirildi", url: "https://cdn.discordapp.com/emojis/817508161447264267.png" },
        { name: "SusturulmaKaldirildi", url: "https://cdn.discordapp.com/emojis/812231974549848134.png" },
        { name: "erkekTepkiID", url: "https://cdn.discordapp.com/emojis/842526029913260082.gif" },
        { name: "kadinTepkiID", url: "https://cdn.discordapp.com/emojis/842526029184237568.gif" },
        { name: "uyeEmojiID", url: "https://cdn.discordapp.com/emojis/842526025216688158.png" },
        { name: "HosgeldinGif1", url: "https://cdn.discordapp.com/emojis/817338444635308042.gif" },
        { name: "HosgeldinGif2", url: "https://cdn.discordapp.com/emojis/817343543228104705.gif" },
        { name: "KonfetiGif", url: "https://cdn.discordapp.com/emojis/840597070812413962.gif"},
        { name: "Gold", url: "https://cdn.discordapp.com/emojis/838240527862333460.gif"},
        { name: "acar", url: "https://cdn.discordapp.com/emojis/841032678266241054.gif"},
        { name: "rubyBit", url: "https://cdn.discordapp.com/emojis/780808227192963094.gif"},
        { name: "emeraldBit", url: "https://cdn.discordapp.com/emojis/780808253017686037.gif"},
        { name: "boostluNitro", url: "https://cdn.discordapp.com/emojis/834837377452474368.gif"},
        { name: "klasikNitro", url: "https://cdn.discordapp.com/emojis/834837383430012969.gif"},
        { name: "maviDegnek", url: "https://cdn.discordapp.com/emojis/843809647675834398.gif"},

            // UpStaff
        { name: "baslangicBar", url: "https://cdn.discordapp.com/emojis/826970314340433950.png" },
        { name: "baslamaBar", url: "https://cdn.discordapp.com/emojis/834983563661279232.gif" },
        { name: "doluBar", url: "https://cdn.discordapp.com/emojis/834983587568549969.gif" },
        { name: "doluBitisBar", url: "https://cdn.discordapp.com/emojis/834983653083185162.gif" },
        { name: "bosBar", url: "https://cdn.discordapp.com/emojis/817567181080494080.png" },
        { name: "bosBitisBar", url: "https://cdn.discordapp.com/emojis/817567181210517554.png" },
        { name: "icon", url: "https://cdn.discordapp.com/emojis/834984612622368818.gif" },
        { name: "miniicon", url: "https://cdn.discordapp.com/emojis/834986935880515614.png" },

            // Task
        { name: "tamamlandi", url: "https://cdn.discordapp.com/emojis/844119157720481814.png" },
        { name: "sandik", url: "https://cdn.discordapp.com/emojis/844119157720481813.png" },
        { name: "para", url: "https://cdn.discordapp.com/emojis/844119157880258590.gif" },
        { name: "xp", url: "https://cdn.discordapp.com/emojis/844119157943042059.gif" },
        { name: "chating", url: "https://cdn.discordapp.com/emojis/844119158069526548.gif" },
        { name: "talking", url: "https://cdn.discordapp.com/emojis/844119158223536138.gif" },
        { name: "777", url: "https://cdn.discordapp.com/emojis/844120308897677342.gif" },
        { name: "kekcookie", url: "https://cdn.discordapp.com/emojis/844121947515519016.gif" },    
        { name: "staff", url: "https://cdn.discordapp.com/emojis/848592182985752636.gif" },   
        { name: "gift", url: "https://cdn.discordapp.com/emojis/826564060807299082.gif" },
        { name: "tagged", url: "https://cdn.discordapp.com/emojis/842563648597131304.gif"},
      ];
  
      const numEmojis = [
        { name: "0a", url: "https://cdn.discordapp.com/emojis/826970483999375431.gif" },
        { name: "1a", url: "https://cdn.discordapp.com/emojis/826970487078518804.gif" },
        { name: "2a", url: "https://cdn.discordapp.com/emojis/826970487669784627.gif" },
        { name: "3a", url: "https://cdn.discordapp.com/emojis/826970487607132191.gif" },
        { name: "4a", url: "https://cdn.discordapp.com/emojis/826970484939554876.gif" },
        { name: "5a", url: "https://cdn.discordapp.com/emojis/826970487854596156.gif" },
        { name: "6a", url: "https://cdn.discordapp.com/emojis/826970485425569832.gif" },
        { name: "7a", url: "https://cdn.discordapp.com/emojis/826970487384703017.gif" },
        { name: "8a", url: "https://cdn.discordapp.com/emojis/826970487741218816.gif" },
        { name: "9a", url: "https://cdn.discordapp.com/emojis/826970488081219584.gif" }
      ];
  
      emojis.forEach(async (x) => {
        if (message.guild.emojis.cache.find((e) => x.name === e.name)) return;
        const emoji = await message.guild.emojis.create(x.url, x.name);
        message.channel.send(`\`${x.name}\` isimli emoji oluşturuldu! (${emoji.toString()})`);
      });
  
      numEmojis.forEach(async (x) => {
        if (message.guild.emojis.cache.find((e) => x.name === e.name)) return;
        const emoji = await message.guild.emojis.create(x.url, x.name);
        message.channel.send(`\`${x.name}\` isimli emoji oluşturuldu! (${emoji.toString()})`);
      });
    

    }
};