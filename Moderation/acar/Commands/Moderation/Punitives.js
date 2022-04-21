const { Client, Message, MessageAttachment} = require("discord.js");
const Punitives = require('../../../Database/Schema/Punitives');
const Kullanıcı = require('../../../Database/Schema/Users');
const table = require('table');
const moment = require('moment');
require("moment-duration-format");
require("moment-timezone");

module.exports = {
    Isim: "cezalar",
    Komut: ["sicil"],
    Kullanim: "cezalar <@sehira/ID>",
    Aciklama: "Belirlenen üyenin bütün ceza verisini gösterir.",
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
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || await client.getUser(args[0]);
    if(!uye) return message.channel.send(cevaplar.üyeyok);
    await Punitives.find({Uye: uye.id}).exec(async (err, res) => {
        if(err) return message.channel.send('Hata: `Bazı hatalar oluştu :(`').then(x => x.delete({timeout: 5000}));
        if(!await Punitives.findOne({Uye: uye.id})) return message.channel.send(`${uye} kullanıcısının ceza bilgisi bulunmuyor.`).then(x => x.delete({timeout: 5000}));;
        let data = [["ID", "🔵", "Ceza Tarihi", "Ceza Türü", "Ceza Sebebi"]];
        data = data.concat(res.map(value => {          
            return [
                `#${value.No}`,
                `${value.Aktif == true ? "✅" : "❌"}`,
                `${tarihsel(value.Tarih)}`,
                `${value.Tip}`,
                `${value.Sebep}`
            ]
        }));
        let veriler = table.table(data, {
           columns: { 0: { paddingLeft: 1 }, 1: { paddingLeft: 1 }, 2: { paddingLeft: 1 }, 3: { paddingLeft: 1, paddingRight: 1 }, },
           border : table.getBorderCharacters(`void`),  
           drawHorizontalLine: function (index, size) {
               return index === 0 || index === 1 || index === size;
           }
        });
        message.channel.send(`:no_entry_sign: <@${uye.id}> kişisinin ceza bilgileri aşağıda belirtilmiştir. Tekli bir cezaya bakmak için \`.ceza ID\` komutunu uygulayınız.\n\`\`\`${veriler}\`\`\``).then(x => {
            x.react("📥").then(async(r) => {
                await x.react('❔');
            });

            const docsDownload = (reaction, user) => reaction.emoji.name === '📥' && user.id === message.author.id;
            const showPoint = (reaction, user) => reaction.emoji.name === '❔' && user.id === message.author.id; 
            
            const docsDownloads = x.createReactionCollector(docsDownload, {  time: 60000 });  
            const showPoints = x.createReactionCollector(showPoint, { time: 60000 });
            x.delete({timeout: 60000})

            docsDownloads.on('collect', async (r) => {
                await r.users.remove(message.author.id).catch(err => {}); 
                let dosyahazırla; 
                dosyahazırla = new MessageAttachment(Buffer.from(veriler), `${uye.id}-cezalar.txt`)
                message.channel.send(`<@${uye.id}> kullanıcısının toplam **${res.length}** cezası aşağıdaki belgede yer almaktadır.`, dosyahazırla).then(msg => {
                    msg.delete({ timeout: 5000 })
                }) 
            })
             showPoints.on('collect', async (r) => {
                await r.users.remove(message.author.id).catch(err => {}); 
                let cezaPuan = await client.cezaPuan(uye.id)
                message.channel.send(`<@${uye.id}> kullanıcısının **${cezaPuan}** ceza puanı bulunmakta. (${cezaPuan >= 50 ? `${message.guild.emojiGöster(emojiler.Iptal)} \`Risk durumu baya yüksek\`` : `${message.guild.emojiGöster(emojiler.Onay)} \`Risk durumu bulunamadı\``})`).then(msg => {
                    msg.delete({timeout: 7500});
                })
            })
        }).catch(acar => {
            let dosyahazırla; 
            dosyahazırla = new MessageAttachment(Buffer.from(veriler), `${uye.id}-cezalar.txt`);
            message.channel.send(`:no_entry_sign: <@${uye.id}> kişisinin cezaları **Discord API** sınırını geçtiği için metin belgesi hazırlayıp gönderdim, oradan cezaları kontrol edebilirsin.\nTekli bir cezaya bakmak için \`.ceza bilgi ID\` komutunu uygulayınız.`, dosyahazırla); 
        });
    })
}
};