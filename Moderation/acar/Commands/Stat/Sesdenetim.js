const { MessageEmbed } = require("discord.js");
const Stats = require('../../../Database/Schema/Stats');
const moment = require('moment');
require('moment-duration-format');
require('moment-timezone');
module.exports = {
    Isim: "denetim",
    Komut: ["sesdenetim","rolstatdenetim"],
    Kullanim: "sesdenetim <@rol/ID>",
    Aciklama: "Belirlenen role sahip üyelerin public, register ve genel ses denetimini sağlar.",
    Kategori: "Stat",
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
    let embed = new MessageEmbed().setColor(ayarlar.embed.altbaşlık).setColor(ayarlar.embed.renk).setAuthor(ayarlar.embed.başlık, message.guild.iconURL({dynamic: true, size: 2048})).setFooter(ayarlar.embed.altbaşlık)
    if(!roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(cevaplar.noyt); 
    const rol = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);
    if (!rol) return message.channel.send('Hata: `İstatistik denetleyebilmem için lütfen bir rol etiketle veya IDsini gir.`');
    if (rol.members.size === 0) return message.channel.send('Hata: `Belirtilen rolde kişi bulunamadığı için işlem iptal edildi.`');
    let Sesdenetim =  await Stats.find({guildID: message.guild.id});
    Sesdenetim = Sesdenetim.filter(s => message.guild.members.cache.has(s.userID) && message.guild.members.cache.get(s.userID).roles.cache.has(rol.id));
    let PublicListele = Sesdenetim.sort((uye1, uye2) => {
        let uye2Toplam = 0;
        uye2.voiceStats.forEach((x, key) => {
            if(key == kanallar.publicKategorisi) uye2Toplam += x
        });
        let uye1Toplam = 0;
        uye1.voiceStats.forEach((x, key) => {
            if(key == kanallar.publicKategorisi) uye1Toplam += x
        });
        return uye2Toplam-uye1Toplam;
    }).slice(0, 15).map((m, index) => {
        let uyeToplam = 0;
        m.voiceStats.forEach((x, key) => { if(key == kanallar.publicKategorisi) uyeToplam += x });
        return `\`${index == 0 ? `👑` : `${index+1}.`}\` ${message.guild.members.cache.get(m.userID).toString()} \`${client.sureCevir(uyeToplam)}\``;
    }).join('\n');
    
    let StreamerListele = Sesdenetim.sort((uye1, uye2) => {
        let uye2Toplam = 0;
        uye2.voiceStats.forEach((x, key) => {
            if(key == kanallar.streamerKategorisi) uye2Toplam += x
        });
        let uye1Toplam = 0;
        uye1.voiceStats.forEach((x, key) => {
            if(key == kanallar.streamerKategorisi) uye1Toplam += x
        });
        return uye2Toplam-uye1Toplam;
    }).slice(0, 15).map((m, index) => {
        let uyeToplam = 0;
        m.voiceStats.forEach((x, key) => { if(key == kanallar.streamerKategorisi) uyeToplam += x });
        return `\`${index == 0 ? `👑` : `${index+1}.`}\` ${message.guild.members.cache.get(m.userID).toString()} \`${client.sureCevir(uyeToplam)}\``;
    }).join('\n');

    let RegisterListele = Sesdenetim.sort((uye1, uye2) => {
        let uye2Toplam = 0;
        uye2.voiceStats.forEach((x, key) => {
            if(key == kanallar.registerKategorisi) uye2Toplam += x
        });
        let uye1Toplam = 0;
        uye1.voiceStats.forEach((x, key) => {
            if(key == kanallar.registerKategorisi) uye1Toplam += x
        });
        return uye2Toplam-uye1Toplam;
    }).slice(0, 15).map((m, index) => {
        let uyeToplam = 0;
        m.voiceStats.forEach((x, key) => { if(key == kanallar.registerKategorisi) uyeToplam += x });
        return `\`${index == 0 ? `👑` : `${index+1}.`}\` ${message.guild.members.cache.get(m.userID).toString()} \`${client.sureCevir(uyeToplam)}\``;
    }).join('\n');

    let SesListele = Sesdenetim.sort((uye1, uye2) => {
        let uye2Toplam = 0;
        uye2.voiceStats.forEach(x => uye2Toplam += x);
        let uye1Toplam = 0;
        uye1.voiceStats.forEach(x => uye1Toplam += x);
        return uye2Toplam-uye1Toplam;
    }).slice(0, 15).map((m, index) => {
        let uyeToplam = 0;
        m.voiceStats.forEach(x => uyeToplam += x);
        return `\`${index == 0 ? `👑` : `${index+1}.`}\` ${message.guild.members.cache.get(m.userID).toString()} \`${client.sureCevir(uyeToplam)}\``;
    }).join('\n');


    await message.channel.send(embed.setDescription(`${rol} (\`${rol.id}\`) rolüne sahip ilk 15 üyenin ses bilgileri aşağıda listelenmekte.`)
    .addFields(
        {name: "Toplam Sıralama", value: SesListele ? SesListele : "Veri Bulunamadı.", inline: true},
        {name: "Public Sıralaması", value: PublicListele ? PublicListele : "Veri Bulunamadı.", inline: true},
        {name: "Register Sıralaması", value: RegisterListele ? RegisterListele : "Veri Bulunamadı.", inline: true},
        {name: "Streamer Sıralaması", value: StreamerListele ? StreamerListele : "Veri Bulunamadı.", inline: false}
    ))
  }
};