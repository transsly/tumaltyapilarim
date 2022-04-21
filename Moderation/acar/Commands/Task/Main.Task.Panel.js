const { Client, Message, MessageEmbed } = require("discord.js");
const moment = require('moment');
require('moment-duration-format');
require('moment-timezone');
const Stats = require('../../../Database/Schema/Stats');
const Taskdata = require('../../../Database/Schema/Managements');
const { MessageButton } = require('discord-buttons');

module.exports = {
    Isim: "görevlerim",
    Komut: ["görev"],
    Kullanim: "görevlerim <@sehira/ID>",
    Aciklama: "Rolüne uygun görevleri listeler tamamlanma durumunu belirtir.",
    Kategori: "Stat",
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
    if(!taskConf.sistem) return;
    if(taskConf.puanlama.sistem) return;
    const embed = new MessageEmbed().setAuthor(ayarlar.embed.başlık, message.guild.iconURL({dynamic: true, size: 2048})).setColor(ayarlar.embed.renk).setThumbnail('https://www.freeiconspng.com/uploads/tasks-icon-15.png').setFooter(ayarlar.embed.altbaşlık)
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    if (!taskConf.yetkiler.some(x => uye.roles.cache.has(x)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.hasPermission('ADMINISTRATOR'))  return message.channel.send(cevaplar.noyt);
    if(!taskConf.yetkiler.some(x => uye.roles.cache.has(x))) return message.channel.send(`${cevaplar.prefix} \`Üzerinizde görev bulunamamaktadır.\``);
    if(uye.roles.cache.has(taskConf.görevsonyetki)) return message.channel.send(`${cevaplar.prefix} \`Son görev rolündesiniz, bütün emeklerin için teşşekür ederiz.\``);
    let görevBilgisi = taskConf.görevler[taskConf.görevler.indexOf(taskConf.görevler.find(x => uye.roles.cache.has(x.rol)))] || taskConf.görevler[taskConf.görevler.length-1];
    
    let Usertask = await Taskdata.findById(uye.id) || {Puan: 0, Invite: 0, Kayıt: 0, Taglı: 0, Yetkili: 0}
    if(!görevBilgisi) return message.channel.send(`${cevaplar.prefix} \`Rolünüze Ait Bir Görev Bulunamadı.\``);

    let data = await Stats.findOne({ guildID: message.guild.id, userID: uye.id });
    
    let public = 0;
    let register = 0;
    let genelses = 0;

    if(data) {
      data.taskVoiceStats.forEach(c => genelses += c);
      data.taskVoiceStats.forEach((value, key) => {
          if(key == kanallar.publicKategorisi) public += Number(client.yetkiliSesSureCevir(value))
          if(key == kanallar.streamerKategorisi) public += Number(client.yetkiliSesSureCevir(value))  
      });
      data.taskVoiceStats.forEach((value, key) => {
        if(key == kanallar.registerKategorisi) register += Number(client.yetkiliSesSureCevir(value))
      })
    };

    embed.setDescription(`${uye}, (${görevBilgisi.rol ? message.guild.roles.cache.get(görevBilgisi.rol) : "@Rol Bulunamadı."}) rolüne ait görevleri aşağıda belirtilmiştir.\n\n**Tamamlanma Durumu**`)
     if(görevBilgisi.public >= 1 && görevBilgisi.genelses >= 1) {
       if(!roller.teyitciRolleri.some(x => uye.roles.cache.has(x))) embed.addFields({ name: `${görevBilgisi.public} Saat Public/Streamer Kanalında Takıl!`, value: `${public >= görevBilgisi.public ? message.guild.emojiGöster(emojiler.Görev.OK) : message.guild.emojiGöster(emojiler.Görev.Ses) } ${progressBar(public ? public : 0, görevBilgisi.public, 6, public)} \`${public >= görevBilgisi.public ? `Tamamlandı!`: `${public} saat / ${görevBilgisi.public} saat`}\`${görevBilgisi.sure ? `\n**Kalan Zaman:** \`${moment.duration(görevBilgisi.sure - Date.now()).format("H [saat], m [dakika] s [saniye]")}\`` : ""}`})
       if(roller.teyitciRolleri.some(x => uye.roles.cache.has(x))) embed.addFields({ name: `${görevBilgisi.public} Saat Register Kanallarında Takıl!`, value: `${register >= görevBilgisi.public ? message.guild.emojiGöster(emojiler.Görev.OK) : message.guild.emojiGöster(emojiler.Görev.Ses) } ${progressBar(register ? register : 0, görevBilgisi.public, 6, register)} \`${register >= görevBilgisi.public ? `Tamamlandı!`: `${register} saat / ${görevBilgisi.public} saat`}\`${görevBilgisi.sure ? `\n**Kalan Zaman:** \`${moment.duration(görevBilgisi.sure - Date.now()).format("H [saat], m [dakika] s [saniye]")}\`` : ""}`})
       
       embed.addFields({ name: `${görevBilgisi.genelses} Saat Tüm Ses Kanallarında Takıl!`, value: `${Number(client.yetkiliSesSureCevir(genelses)) >= görevBilgisi.genelses ? message.guild.emojiGöster(emojiler.Görev.OK) : message.guild.emojiGöster(emojiler.Görev.Mesaj) } ${progressBar(Number(client.yetkiliSesSureCevir(genelses)) ? Number(client.yetkiliSesSureCevir(genelses)) : 0, görevBilgisi.genelses, 6, Number(client.yetkiliSesSureCevir(genelses)))} \`${Number(client.yetkiliSesSureCevir(genelses)) >= görevBilgisi.genelses ? `Tamamlandı!`: `${Number(client.yetkiliSesSureCevir(genelses))} saat / ${görevBilgisi.genelses} saat`}\`${görevBilgisi.sure ? `\n**Kalan Zaman:** \`${moment.duration(görevBilgisi.sure - Date.now()).format("H [saat], m [dakika] s [saniye]")}\`` : ""}`})
      }
    if(roller.teyitciRolleri.some(x => uye.roles.cache.has(x)) && görevBilgisi.kayıt >= 1) embed.addFields({ name: `${görevBilgisi.kayıt} Kişiyi Kayıt Et!`, value: `${Usertask.Kayıt >= görevBilgisi.kayıt ? message.guild.emojiGöster(emojiler.Görev.OK) : message.guild.emojiGöster(emojiler.Görev.Kek) } ${progressBar(Usertask.Kayıt ? Usertask.Kayıt : 0, görevBilgisi.kayıt, 6, Usertask.Kayıt)} \`${Usertask.Kayıt >= görevBilgisi.kayıt ? `Tamamlandı!`: `${Usertask.Kayıt} / ${görevBilgisi.kayıt}`}\`${görevBilgisi.Ödül ? `\n**Ödül:** ${message.guild.emojiGöster(emojiler.Görev.Para)} \`${görevBilgisi.kayıt * 42 * 3 * 1}\` Coin` : ""}${Usertask.Kayıt >= görevBilgisi.kayıt ? ``: `${görevBilgisi.sure ? `\n**Kalan Zaman:** \`${moment.duration(görevBilgisi.sure - Date.now()).format("H [saat], m [dakika] s [saniye]")}\`` : ""}`}` })
    if(görevBilgisi.invite >= 1) embed.addFields({ name: `${görevBilgisi.invite} Kişiyi Davet Et!`, value: `${Usertask.Invite >= görevBilgisi.invite ? message.guild.emojiGöster(emojiler.Görev.OK) : message.guild.emojiGöster(emojiler.Görev.Kek) } ${progressBar(Usertask.Invite ? Usertask.Invite : 0, görevBilgisi.invite, 6, Usertask.Invite)} \`${Usertask.Invite >= görevBilgisi.invite ? `Tamamlandı!`: `${Usertask.Invite} / ${görevBilgisi.invite}`}\`${görevBilgisi.Ödül ? `\n**Ödül:** ${message.guild.emojiGöster(emojiler.Görev.Para)} \`${görevBilgisi.invite * 42 * 3 * 1}\` Coin` : ""}${Usertask.Invite >= görevBilgisi.invite ? ``: `${görevBilgisi.sure ? `\n**Kalan Zaman:** \`${moment.duration(görevBilgisi.sure - Date.now()).format("H [saat], m [dakika] s [saniye]")}\`` : ""}`}` })
    if(görevBilgisi.taglı >= 1) embed.addFields({ name: `${görevBilgisi.taglı} Kişiyi Taga Davet Et!`, value: `${Usertask.Taglı >= görevBilgisi.taglı ? message.guild.emojiGöster(emojiler.Görev.OK) : message.guild.emojiGöster(emojiler.Görev.Taglı) } ${progressBar(Usertask.Taglı ? Usertask.Taglı : 0, görevBilgisi.taglı, 6, Usertask.Taglı)} \`${Usertask.Taglı >= görevBilgisi.taglı ? `Tamamlandı!`: `${Usertask.Taglı} / ${görevBilgisi.taglı}`}\`${görevBilgisi.Ödül ? `\n**Ödül:** ${message.guild.emojiGöster(emojiler.Görev.Para)} \`${görevBilgisi.taglı * 42 * 3 * 1}\` Coin` : ""}${Usertask.Taglı >= görevBilgisi.taglı ? ``: `${görevBilgisi.sure ? `\n**Kalan Zaman:** \`${moment.duration(görevBilgisi.sure - Date.now()).format("H [saat], m [dakika] s [saniye]")}\`` : ""}`}` }) 
    if(görevBilgisi.yetkili >= 1) embed.addFields({ name: `${görevBilgisi.yetkili} Kişiyi Yetkiye Davet Et!`, value: `${Usertask.Yetkili >= görevBilgisi.yetkili ? message.guild.emojiGöster(emojiler.Görev.OK) : message.guild.emojiGöster(emojiler.Görev.Yetkili) } ${progressBar(Usertask.Yetkili ? Usertask.Yetkili : 0, görevBilgisi.yetkili, 6, Usertask.Yetkili)} \`${Usertask.Yetkili >= görevBilgisi.yetkili ? `Tamamlandı!`: `${Usertask.Yetkili} / ${görevBilgisi.yetkili}`}\`${görevBilgisi.Ödül ? `\n**Ödül:** ${message.guild.emojiGöster(emojiler.Görev.Para)} \`${görevBilgisi.yetkili * 42 * 3 * 1}\` Coin` : ""}${Usertask.Yetkili >= görevBilgisi.yetkili ? ``: `${görevBilgisi.sure ? `\n**Kalan Zaman:** \`${moment.duration(görevBilgisi.sure - Date.now()).format("H [saat], m [dakika] s [saniye]")}\`` : ""}`}` })    
    let YeniRol = taskConf.görevler[taskConf.görevler.indexOf(görevBilgisi)+1];
    let roldurumu;
    if(YeniRol) roldurumu = `Şu an ${görevBilgisi ? message.guild.roles.cache.get(görevBilgisi.rol) : "@Rol Bulunamadı"} rolündesiniz. ${YeniRol ? message.guild.roles.cache.get(YeniRol.rol) : "@Rol Bulunamadı"} rolüne ulaşmak için! tüm görevleri tamamlamalısınız.`
    if(!YeniRol) roldurumu = `Şu an son roldesiniz! Emekleriniz için teşekkür ederiz.`;
    embed.addField(`Rol Durumu`, roldurumu)
    if(message.member.id == uye.id) {
      var button_1 = new MessageButton().setID("ödülal").setLabel("Ödülleri Topla").setEmoji(emojiler.Görev.OK, true).setStyle("red");
      let msg = await message.channel.send({ buttons : [ button_1 ], embed: embed })
      var filter = (button) => button.clicker.user.id === message.member.id;
      let collector = await msg.createButtonCollector(filter, { time: 30000 })

      collector.on("collect", async (button) => {
        if(button.id === "ödülal") {
            await button.reply.think(true)
            await button.reply.edit(`Tamamlanan görevler, otomatik olarak üzerinize verilecektir. `)
		var button_2 = new MessageButton().setLabel("İstek Gönderildi").setID("GGIPTAL").setDisabled().setEmoji(emojiler.Görev.OK, true).setStyle("green");
	    await msg.edit({buttons: [button_2], embed: embed})
          if(Usertask && Usertask.Invite >= görevBilgisi.invite && (görevBilgisi.invite >= 1 && !Usertask.InviteÖdül)) {
            await Taskdata.updateOne({_id: uye.id}, { $set: { "InviteÖdül": true }}, {upsert: true})
            uye.coinAdd(görevBilgisi.invite * 42 * 3 * 1).catch(x => {})
            message.channel.send(`${message.guild.emojiGöster(emojiler.Onay)} Başarıyla **davet** görevinden \`${görevBilgisi.invite * 42 * 3 * 1}\` ${message.guild.emojiGöster(emojiler.Görev.Para)} coin kazandın.`).then(x => x.delete({timeout: 5000}));
          }
    
          if(Usertask && Usertask.Kayıt >= görevBilgisi.kayıt && (görevBilgisi.kayıt >= 1 && !Usertask.KayıtÖdül)) {
            await Taskdata.updateOne({_id: uye.id}, { $set: { "KayıtÖdül": true }}, {upsert: true})
            uye.coinAdd(görevBilgisi.kayıt * 42 * 3 * 1).catch(x => {})
            message.channel.send(`${message.guild.emojiGöster(emojiler.Onay)} Başarıyla **kayıt** görevinden \`${görevBilgisi.kayıt * 42 * 3 * 1}\` ${message.guild.emojiGöster(emojiler.Görev.Para)} coin kazandın.`).then(x => x.delete({timeout: 5000}));
          }
    
          if(Usertask && Usertask.Yetkili >= görevBilgisi.yetkili && (görevBilgisi.yetkili >= 1 && !Usertask.YetkiliÖdül)) {
            await Taskdata.updateOne({_id: uye.id}, { $set: { "YetkiliÖdül": true }}, {upsert: true})
            uye.coinAdd(görevBilgisi.yetkili * 42 * 3 * 1).catch(x => {})
            message.channel.send(`${message.guild.emojiGöster(emojiler.Onay)} Başarıyla **yetkili** görevinden \`${görevBilgisi.yetkili * 42 * 3 * 1}\` ${message.guild.emojiGöster(emojiler.Görev.Para)} coin kazandın.`).then(x => x.delete({timeout: 5000}));
          }
    
          if(Usertask && Usertask.Taglı >= görevBilgisi.taglı && (görevBilgisi.taglı >= 1 && !Usertask.TaglıÖdül)) {
            await Taskdata.updateOne({_id: uye.id}, { $set: { "TaglıÖdül": true }}, {upsert: true})
            uye.coinAdd(görevBilgisi.taglı * 42 * 3 * 1).catch(x => {})
            message.channel.send(`${message.guild.emojiGöster(emojiler.Onay)} Başarıyla **taglı** görevinden \`${görevBilgisi.taglı * 42 * 3 * 1}\` ${message.guild.emojiGöster(emojiler.Görev.Para)} coin kazandın.`).then(x => x.delete({timeout: 5000}));
          }
        }
      });

      collector.on("end", async () => {
        msg.delete().catch(x => {})
      });
      } else {
        message.channel.send({embed: embed})
      }
    function progressBar(value, maxValue, size, veri) {
      if(veri < 0) value = 0
      const progress = Math.round(size * ((value / maxValue) > 1 ? 1 : (value / maxValue)));
      const emptyProgress = size - progress > 0 ? size - progress : 0;
      let progressStart;
      if(veri <= 0) progressStart = `${message.guild.emojis.cache.get(emojiler.Terfi.başlangıçBar)}`
      if(veri > 0) progressStart = `${message.guild.emojis.cache.get(emojiler.Terfi.başlamaBar)}`
      const progressText = `${message.guild.emojis.cache.get(emojiler.Terfi.doluBar)}`.repeat(progress)
      const emptyProgressText = `${message.guild.emojis.cache.get(emojiler.Terfi.boşBar)}`.repeat(emptyProgress)
      const bar = progressStart + progressText + emptyProgressText + `${emptyProgress == 0 ? `${message.guild.emojis.cache.get(emojiler.Terfi.doluBitişBar)}` : `${message.guild.emojis.cache.get(emojiler.Terfi.boşBitişBar)}`}`;
      return bar;
    };
  }
};