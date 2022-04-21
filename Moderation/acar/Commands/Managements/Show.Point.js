const { Client, Message, MessageEmbed } = require("discord.js");
const moment = require('moment');
require('moment-duration-format');
require('moment-timezone');
const Stats = require('../../../Database/Schema/Stats');
const Taskdata = require('../../../Database/Schema/Managements');
const Tasks = require('../../../Database/Schema/Managements');
const {MessageButton} = require('discord-buttons')
module.exports = {
    Isim: "puan",
    Komut: ["puanım","puanim"],
    Kullanim: "puan <@sehira/ID>",
    Aciklama: "Yönetim puanınızı görüntüler.",
    Kategori: "Yönetim Sistemi",
    Extend: true,
    
   /**
   * @param {Client} client 
   */
  onLoad: function (client) {
    client.yetkiliSesSureCevir = (date) => { return moment.duration(date).format('H'); };
  },

   /**
   * @param {Client} client 
   * @param {Message} message 
   * @param {Array<String>} args 
   */

  onRequest: async function (client, message, args) {
    if(!taskConf.puanlama.sistem) return;
    const embed = new MessageEmbed().setAuthor(ayarlar.embed.başlık, message.guild.iconURL({dynamic: true, size: 2048})).setColor(ayarlar.embed.renk).setThumbnail('https://cdn.pixabay.com/photo/2016/03/31/14/48/star-1292832_960_720.png')
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    if (!taskConf.yetkiler.some(x => uye.roles.cache.has(x)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.hasPermission('ADMINISTRATOR'))  return message.channel.send(cevaplar.noyt);
    if(!taskConf.yetkiler.some(x => uye.roles.cache.has(x))) return message.channel.send(`${cevaplar.prefix} ${message.member.id == uye.id ? `Yönetim yetkilisi olmadığınız için paneli görüntüleyemezsiniz.` : `${uye} isimli üye yönetim yetkisi üzerinde bulunamadığı için paneli görüntüleyemezsiniz.`}`);
    if(uye.roles.cache.has(taskConf.görevsonyetki)) return message.channel.send(`${cevaplar.prefix} Son yönetim yetkisine ulaştığınız için paneli görüntüleyemezsiniz.`);
    let görevBilgisi = taskConf.görevler[taskConf.görevler.indexOf(taskConf.görevler.find(x => uye.roles.cache.has(x.rol)))] || taskConf.görevler[taskConf.görevler.length-1];
    let Usertask = await Taskdata.findById(uye.id) || { Puan: 0 }
    if(!Usertask.baslamaTarih && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(`${cevaplar.prefix} Daha önce puan kazanılmadığından dolayı tablo listelenemedi.`).then(x => {
        setTimeout(() => {
            x.delete()
        }, 3000);
    });
    embed.setDescription(`${uye}, (${görevBilgisi.rol ? message.guild.roles.cache.get(görevBilgisi.rol) : "@Rol Bulunamadı."}) üyesinin \`${tarihsel(Usertask.baslamaTarih || Date.now())}\` tarihinden itibaren puanlama tablosu aşağıda belirtilmiştir.`) 
    embed.addFields(
        {name: `${message.guild.emojis.cache.get(emojiler.Tag)} Bilgilendirme`, value: `Aşağıda gördüğünüz puanlama tablosunda, işlenen yetki puanınız görüntülenmektedir. Puanlamaya göre sizi daha adil yetkilendirmek için puanlarınız kullanılmaktadır.`},
        {name: `${message.guild.emojis.cache.get(emojiler.Terfi.icon)} Puan Bilgisi`, value: `${message.guild.emojis.cache.get(emojiler.Terfi.miniicon)} ${message.member.id == uye.id ? `Toplam Puanınız` : `Toplam Puan`}: \`${Usertask.Puan ? `+${Usertask.Puan}` : `0`} Puan\`
${message.guild.emojis.cache.get(emojiler.Terfi.miniicon)} ${message.member.id == uye.id ? `Seste Puanınız` : `Seste Puan`}: \`${Usertask.SesPuan > 0 ? `+${Usertask.SesPuan}` : `0`} Puan\`
${message.guild.emojis.cache.get(emojiler.Terfi.miniicon)} ${message.member.id == uye.id ? `Yetkili Puanınız` : `Yetkili Puan`}: \`${Usertask.YetkiliPuan > 0 ? `+${Usertask.YetkiliPuan}` : `0`} Puan\`
${message.guild.emojis.cache.get(emojiler.Terfi.miniicon)} ${message.member.id == uye.id ? `Taglı Puanınız` : `Taglı Puan`}: \`${Usertask.TagliPuan > 0 ? `+${Usertask.TagliPuan}` : `0`} Puan\`
${message.guild.emojis.cache.get(emojiler.Terfi.miniicon)} ${message.member.id == uye.id ? `Davet Puanınız` : `Davet Puan`}: \`${Usertask.InvitePuan > 0 ? `+${Usertask.InvitePuan}` : `0`} Puan\`
${message.guild.emojis.cache.get(emojiler.Terfi.miniicon)} ${message.member.id == uye.id ? `Kayıt Puanınız` : `Kayıt Puan`}: \`${Usertask.KayitPuan > 0 ? `+${Usertask.KayitPuan}` : `0`} Puan\`
${message.guild.emojis.cache.get(emojiler.Terfi.miniicon)} ${message.member.id == uye.id ? `Bonus Puanınız` : `Bonus Puan`}: \`${Usertask.BonusPuan > 0 ? `+${Usertask.BonusPuan}` : `0`} Puan\``},
        {name: `${message.guild.emojis.cache.get(emojiler.Terfi.icon)} Net Puanlama Bilgisi`, value: `${message.guild.emojis.cache.get(emojiler.Terfi.miniicon)} Seste kalarak, ortalama olarak \`+${taskConf.puanlama.sesPuan}\` puan kazanırsınız.
${message.guild.emojis.cache.get(emojiler.Terfi.miniicon)} Taglı üye belirleyerek, \`+${taskConf.puanlama.tagliPuan}\` puan kazanırsınız.
${message.guild.emojis.cache.get(emojiler.Terfi.miniicon)} Yetkili belirleyerek, \`+${taskConf.puanlama.yetkiliPuan}\` puan kazanırsınız.
${message.guild.emojis.cache.get(emojiler.Terfi.miniicon)} İnsanları davet ederek, \`+${taskConf.puanlama.invitePuan}\` puan kazanırsın.
${message.guild.emojis.cache.get(emojiler.Terfi.miniicon)} Kayıt işlemi yaparak, \`+${taskConf.puanlama.kayitPuan}\` puan kazanırsın.`

},
    )
    if(roller.kurucuRolleri.some(x => message.member.roles.cache.has(x)) || message.member.hasPermission('ADMINISTRATOR') || sistem.staff.find(x => x.id == message.member.id)) {
        var button_1 = new MessageButton().setID("ödülal").setLabel("Yükselt").setEmoji(emojiler.Görev.OK, true).setStyle("green");
        var button_4 = new MessageButton().setID("dsr").setLabel("Düşür").setEmoji(emojiler.Iptal, true).setStyle("red");
        let msg = await message.channel.send({ buttons : [ button_1, button_4 ], embed: embed })
        var filter = (button) => button.clicker.user.id === message.member.id;
        let collector = await msg.createButtonCollector(filter, { time: 30000 })
  
        collector.on("collect", async (button) => {
          if(button.id === "ödülal") {
              await button.reply.defer()
          var button_2 = new MessageButton().setLabel("Yükseltme İşlemi Tamamlandı!").setID("GGIPTAL").setDisabled().setEmoji(emojiler.Görev.OK, true).setStyle("gray");
          await msg.edit({buttons: [button_2], embed: embed})
          let newMap = new Map();
          await Stats.updateOne({ userID: uye.id }, { taskVoiceStats: newMap });
          await Tasks.findByIdAndDelete(uye.id);
          let görevBilgisi = taskConf.görevler[taskConf.görevler.indexOf(taskConf.görevler.find(x => uye.roles.cache.has(x.rol)))] || taskConf.görevler[taskConf.görevler.length-1];
          let YeniRol = taskConf.görevler[taskConf.görevler.indexOf(görevBilgisi)+1];
          if(görevBilgisi && YeniRol) uye.roles.remove(görevBilgisi.rol)
          if(YeniRol) await uye.roles.add(YeniRol.rol)
          if(!YeniRol) return message.channel.send(cevaplar.prefix + ' `Yükseltilebilecek bir rol veya bir yetki bulunamadı ve yükseltme işlemi iptal edildi.`').then(x => { 
            x.delete({timeout: 3500}) 
            message.react(emojiler.Iptal)
          });
          message.react(emojiler.Onay)
          message.guild.kanalBul("task-log").send(embed.setDescription(`${message.author} isimli yetkili ${uye.toString()} isimli üyeyi \`${tarihsel(Date.now())}\` tarihinde ${YeniRol ? message.guild.roles.cache.get(YeniRol.rol): "@Rol Bulunamadı"} isimli role yükseltti!`))
          await message.channel.send(`${message.guild.emojiGöster(emojiler.Onay)} ${uye} isimli yönetim yetkilisinin yetkisi başarıyla \`${YeniRol ? message.guild.roles.cache.get(YeniRol.rol).name: "@Rol Bulunamadı"}\` yetkisine yükseltildi.`)
          }
          if(button.id === "dsr") {
            await button.reply.defer()
            var button_3 = new MessageButton().setLabel("Düşürme İşlemi Tamamlandı!").setID("GGIPTAL").setDisabled().setEmoji(emojiler.Görev.OK, true).setStyle("gray");
            await msg.edit({buttons: [button_3], embed: embed})
            let newMap = new Map();
            await Stats.updateOne({ userID: uye.id }, { taskVoiceStats: newMap });
            await Tasks.findByIdAndDelete(uye.id);
            let yetkiBilgisi = taskConf.görevler[taskConf.görevler.indexOf(taskConf.görevler.find(x => uye.roles.cache.has(x.rol)))] || taskConf.görevler[taskConf.görevler.length-1];
            let YeniRol = taskConf.görevler[taskConf.görevler.indexOf(yetkiBilgisi)-1];
            if(yetkiBilgisi && YeniRol) uye.roles.remove(yetkiBilgisi.rol)
            if(YeniRol) await uye.roles.add(YeniRol.rol)
            if(!YeniRol) return message.channel.send(cevaplar.prefix + ' `Düşürebilecek bir rol veya bir yetki bulunamadı ve düşürme işlemi iptal edildi.`').then(x => { 
              x.delete({timeout: 3500}) 
              message.react(emojiler.Iptal)
            });
            message.react(emojiler.Onay)
            message.guild.kanalBul("task-log").send(embed.setDescription(`${message.author} isimli yetkili ${uye.toString()} isimli üyeyi \`${tarihsel(Date.now())}\` tarihinde ${YeniRol ? message.guild.roles.cache.get(YeniRol.rol): "@Rol Bulunamadı"} isimli role düşürüldü!`))
            await message.channel.send(`${message.guild.emojiGöster(emojiler.Onay)} ${uye} isimli yönetim yetkilisinin yetkisi başarıyla \`${YeniRol ? message.guild.roles.cache.get(YeniRol.rol).name: "@Rol Bulunamadı"}\` yetkisine düşürüldü.`)
          }
        });
  
        collector.on("end", async () => {
          msg.delete().catch(x => {})
        });
        } else {
          message.channel.send({embed: embed})
        } 
    

  }
};
