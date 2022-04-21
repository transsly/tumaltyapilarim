const { Client, Message, MessageEmbed} = require("discord.js");
const Punitives = require('../../../Database/Schema/Punitives');
const Jail = require('../../../Database/Schema/Jails');
const Users = require('../../../Database/Schema/Users');
module.exports = {
    Isim: "unban",
    Komut: ["yasaklama-kaldır","bankaldır","yasaklamakaldır"],
    Kullanim: "unban <@sehira/ID>",
    Aciklama: "Belirlenen üyenin yasaklamasını kaldırır.",
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
    let embed = new MessageEmbed().setAuthor(ayarlar.embed.başlık, message.guild.iconURL({dynamic: true})).setColor(ayarlar.embed.renk).setFooter(ayarlar.embed.altbaşlık)
    if(!roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(cevaplar.noyt);
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || await client.getUser(args[0])    
    if(!uye) return message.channel.send(cevaplar.üye + ` \`${sistem.prefix}${module.exports.Isim} <@sehira/ID>\``);
    if(message.author.id === uye.id) return message.channel.send(cevaplar.kendi);
    await Punitives.findOne({Uye: uye.id, Tip: "Yasaklanma", Aktif: true}).exec(async (err, res) => {
        message.guild.fetchBans().then(async(yasaklar)=> {
            if(yasaklar.size == 0) return message.channel.send(cevaplar.yasaklamayok)
            let yasakliuye = yasaklar.find(yasakli => yasakli.user.id == uye.id)
            if(!yasakliuye) return message.channel.send(`${cevaplar.prefix} \`Belirtilen Üye Yasaklı Değil!\` lütfen geçerli bir yasaklama giriniz.`);
            if(res) {
                if(res.Yetkili !== message.author.id && !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(embed.setDescription(`${res.Yetkili ? `${message.guild.members.cache.get(res.Yetkili)} (\`${res.Yetkili}\`)` :  `${res.Yetkili}`} tarafından cezalandırılmış, senin bu cezalandırmayı açman münkün gözükmüyor.`));
            }
            if(res) await Punitives.updateOne({ No: res.No }, { $set: { "Aktif": false, Bitis: Date.now(), Kaldiran: message.member.id} }, { upsert: true }).exec();
            await message.guild.members.unban(uye.id);
            await message.guild.channels.cache.find(x => x.name == "ban-log").send(embed.setDescription(`${uye} uyesinin sunucudaki ${res ? `\`#${res.No}\` ceza numaralı yasaklaması` : "yasaklaması"}, **${tarihsel(Date.now())}** tarihinde ${message.author} tarafından kaldırıldı.`))
            await message.channel.send(`${message.guild.emojiGöster(emojiler.Tag)} ${uye} üyesinin ${res ? `(\`#${res.No}\`) ceza numaralı` : "sunucudaki"} yasaklaması kaldırıldı!`);
            message.react(emojiler.Onay)
        })
    })
    }
};