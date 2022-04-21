const { Client, Message, MessageEmbed} = require("discord.js");
const Beklet = new Set();
module.exports = {
    Isim: "kes",
    Komut: ["bağlantı-kes", "bkes"],
    Kullanim: "kes <@sehira/ID> <Sebep>",
    Aciklama: "Belirlenen üyeyi sesten atar.",
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
    if(!roller.altYönetimRolleri.includes(oku => message.member.roles.cache.has(oku)) && !roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku))  && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(cevaplar.noyt);
    if(Beklet.has(message.author.id)) return message.channel.send(`${cevaplar.prefix} \`Günlük Limit Aşıldı!\` ikiden fazla bağlantı kesme işlemi uygulandığı için.`).then(x => x.delete({timeout: 7500}));
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]) 
    if(!uye) return message.channel.send(cevaplar.üye + ` \`${sistem.prefix}${module.exports.Isim} <@sehira/ID> <Sebep>\``);
    if(message.author.id === uye.id) return message.channel.send(cevaplar.kendi);
    if(uye.user.bot) return message.channel.send(cevaplar.bot);
    if(message.member.roles.highest.position <= uye.roles.highest.position) return message.channel.send(cevaplar.yetkiust);
    let sebep = args.splice(1).join(" ");
    if(!sebep) return message.channel.send(cevaplar.sebep);
    message.guild.kanalBul("bkes-log").send(embed.setDescription(`${uye} üyesi ${message.author} tarafından ${tarihsel(Date.now())} tarihinde ${uye.voice.channel ? message.guild.channels.cache.get(uye.voice.channelID) : "#Kanal Bulunamadı"} belirtilen sesli kanalından atıldı.`))
    await uye.voice.kick()
    message.react(emojiler.Onay);
    message.delete({timeout: 7500})

    if(!roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.hasPermission('ADMINISTRATOR') && !sistem.staff.find(x => x.id == message.member.id)) Beklet.add(message.author.id);
        setTimeout(() => {
          Beklet.delete(message.author.id);
        }, 86400000);

    uye.send(embed.setDescription(`${message.author} tarafından \`${sebep}\` sebebi ile **${tarihsel(Date.now())}** tarihinde bulunduğun sesten atıldın.`)).catch(x => {
      message.channel.send(`${cevaplar.prefix} ${uye} üyesinin özel mesajları kapalı olduğundan dolayı bilgilendirme gönderilemedi.`).then(x => x.delete({timeout: 5000}))
  })
    }
};