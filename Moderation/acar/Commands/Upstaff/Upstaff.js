const { MessageEmbed } = require("discord.js");
const Stats = require('../../../Database/Schema/Stats');
const InviteData = require('../../../Database/Schema/Invites');
const Users = require('../../../Database/Schema/Users');
const Upstaffs = require('../../../Database/Schema/Upstaffs');
const { MessageButton } = require('discord-buttons');

const moment = require('moment');
require('moment-duration-format');
require('moment-timezone');

module.exports = {
    Isim: "terfi",
    Komut: ["yetkim","ystat","yetkilistat"],
    Kullanim: "yetkim <@sehira/ID>",
    Aciklama: "Belirlenen üye veya kullanan üye eğer ki yetkiliyse onun yetki atlama bilgilerini gösterir.",
    Kategori: "Stat",
    Extend: true,
    
   /**
   * @param {Client} client 
   */
  onLoad: function (client) {
    client.saatDakikaCevir = (date) => { return moment.duration(date).format('H [saat,] m [dakika]'); };
  },

   /**
   * @param {Client} client 
   * @param {Message} message 
   * @param {Array<String>} args 
   */

  onRequest: async function (client, message, args) {
    if(!uPConf.sistem) return; 
    let kullArray = message.content.split(" ");
    let kullaniciId = kullArray.slice(1);
    let uye = message.mentions.members.first() || message.guild.members.cache.get(kullaniciId[0]) || message.guild.members.cache.find(x => x.user.username.toLowerCase() === kullaniciId.slice(0).join(" ") || x.user.username === kullaniciId[0]) || message.member;
    if (!uPConf.yetkiler.some(x => message.member.roles.cache.has(x)) && !message.member.hasPermission('ADMINISTRATOR'))  return message.channel.send(cevaplar.noyt);
    if(message.member.roles.cache.has(uPConf.sonyetki) && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(`${cevaplar.prefix} \`Zaten son alt yetkidesin, bütün emeklerin için teşşekür ederiz.\``);
    const puanBilgisi = await Upstaffs.findOne({ _id: uye.id })
    const davetbilgisi = await InviteData.findOne({userID: uye.id}) || { regular: 0, bonus: 0, fake: 0 };
    
    Stats.findOne({ guildID: message.guild.id, userID: uye.id }, async (err, data) => {
        if(!puanBilgisi) return message.channel.send(`${cevaplar.prefix} \`Üzgünüm henüz bir puan kazanma durumu olmamış.\``).then(x => x.delete({timeout: 7500}));
        const yeniRol = uPConf.yetkipuan[uPConf.yetkipuan.indexOf(uPConf.yetkipuan.find(x => x.No == (puanBilgisi ? puanBilgisi.staffNo : 0)))] || uPConf.yetkipuan[uPConf.yetkipuan.length-1];
        const eskiRol = uPConf.yetkipuan[uPConf.yetkipuan.indexOf(uPConf.yetkipuan.find(x => x.No == (puanBilgisi ? puanBilgisi.staffExNo : 0)))] || uPConf.yetkipuan[uPConf.yetkipuan.length-1];
        const puanBelirt = uPConf.yetkipuan.find(x => x.No == puanBilgisi.staffNo) ? uPConf.yetkipuan.find(x => x.No == puanBilgisi.staffNo).Puan : eskiRol.Puan
        const puanBari = uPConf.yetkiler.some(x => uye.roles.cache.has(x)) && uPConf.yetkipuan.length > 0 ? `\`%${Math.floor((puanBilgisi ? puanBilgisi.Point.toFixed(1) : 0)/puanBelirt*100)}\` ${progressBar(puanBilgisi ? puanBilgisi.Point.toFixed(1) : 0, puanBelirt, 6, puanBilgisi.Point.toFixed(1))} \`${puanBilgisi ? puanBilgisi.Point.toFixed(1) : 0} / ${puanBelirt}\`` : "";
        
        let ToplamPuan = Number(0) 
        uPConf.yetkipuan.filter(x => x.Puan).forEach(x => {
        ToplamPuan += Number(x.Puan)
        })
        const genelpuanBari = uPConf.yetkiler.some(x => uye.roles.cache.has(x)) && uPConf.yetkipuan.length > 0 ? `\`%${Math.floor((puanBilgisi.ToplamPuan)/ToplamPuan*100)}\` ${progressBar(puanBilgisi ? puanBilgisi.ToplamPuan.toFixed(1) : 0, ToplamPuan, 6, puanBilgisi.ToplamPuan.toFixed(1))} \`${puanBilgisi ? puanBilgisi.ToplamPuan.toFixed(1) : 0} / ${ToplamPuan}\`` : "";
        
        let cezapuanoku = await client.cezaPuan(uye.id)
        let teyitoku = await Users.findOne({ id: uye.id }) || []
        let teyitbilgi;
        if(teyitoku) {
            if(teyitoku.Teyitler) {
                    let erkekteyit = teyitoku.Teyitler.filter(v => v.Cinsiyet === "erkek").length
                    let kadınteyit = teyitoku.Teyitler.filter(v => v.Cinsiyet === "kadın").length
                    let toplamteyit = erkekteyit + kadınteyit
                    teyitbilgi = `+${toplamteyit * uPConf.odül.kayıt} Puan`
                } else { teyitbilgi = `0 Puan` }
            } else {
                teyitbilgi = `0 Puan`
        }
        let taglıÇek = await teyitoku ? teyitoku.Taglılar ? teyitoku.Taglılar.length || 0 : 0 : 0
        let yetkidurumu;
        if(yeniRol) yetkidurumu = `Şu an <@&${eskiRol.rol}> rolündesiniz. bir sonraki <@&${yeniRol.rol}> rolüne ulaşmak için \`${Number(puanBelirt-puanBilgisi.Point).toFixed(1)}\` puan kazanmanız gerekiyor. Şuan da \`%${Math.floor((puanBilgisi ? puanBilgisi.Point.toFixed(1) : 0)/puanBelirt*100)}\` oranında tamamladınız.`
        if(yeniRol.rol == eskiRol.rol) yetkidurumu = `Şu an son yetkidesiniz! Emekleriniz için teşekkür ederiz.`;
        let siralases = '';
        let siralamesaj = `${message.guild.emojis.cache.get(emojiler.Terfi.miniicon)} Chat Puan: \`0 mesaj (Puan Etkisi: +0)\``

        let simdises = '';
        let simdimesaj = `${message.guild.emojis.cache.get(emojiler.Terfi.miniicon)} Chat Puan: \`0 mesaj (Puan Etkisi: +0)\``

        if(data) {
            puanBilgisi.ToplamSesListe.forEach((value, key) => {
                    let kategori = StConf.seskategoriler.find(x => x.id == key)
		    if(kategori) {
                     let kategoriismi = kategori.isim
                     let puan = 0;
                     if(puanBilgisi.ToplamSesListe) puanBilgisi.ToplamSesListe.forEach((v, k) => { if(k == key) puan = v })
                     siralases += `${message.guild.emojis.cache.get(emojiler.Terfi.miniicon)} ${message.guild.channels.cache.has(key) ? kategoriismi ? kategoriismi : kategoriismi : '#Silinmiş'}: \`+${Number(puan).toFixed(1)} Puan\`\n`
            	    }
            })
            data.chatStats.forEach((value, key) => {
                if(key == uPConf.chatKategorisi) siralamesaj = `${message.guild.emojis.cache.get(emojiler.Terfi.miniicon)} ${message.guild.channels.cache.has(key) ? 'Chat Puan' ? 'Chat Puan' : message.guild.channels.cache.get(key).name : '#Silinmiş'}: \`+${puanBilgisi ? puanBilgisi.ToplamMesaj.toFixed(1) : 0} Puan\``
            });

            data.upstaffVoiceStats.forEach((value, key) => {
                if(uPConf.izinliKategoriler.some(x => x == key)) {
                    let kategori = StConf.seskategoriler.find(x => x.id == key)
                    if(kategori) {
		     let kategoriismi = kategori.isim
                     let puan = 0;
                     if(puanBilgisi.Ses) puanBilgisi.Ses.forEach((v, k) => { if(k == key) puan = v })
                     simdises += `${message.guild.emojis.cache.get(emojiler.Terfi.miniicon)} ${message.guild.channels.cache.has(key) ? kategoriismi ? kategoriismi : kategoriismi : '#Silinmiş'}: \`${client.saatDakikaCevir(value)} (Puan Etkisi: +${Number(puan).toFixed(1)})\`\n`
                    }
                }
            })
            data.upstaffChatStats.forEach((value, key) => {
                if(key == uPConf.chatKategorisi) simdimesaj = `${message.guild.emojis.cache.get(emojiler.Terfi.miniicon)} ${message.guild.channels.cache.has(key) ? 'Chat Puan' ? 'Chat Puan' : message.guild.channels.cache.get(key).name : '#Silinmiş'}: \`${value} mesaj (Puan Etkisi: +${puanBilgisi ? puanBilgisi.Mesaj.toFixed(1) : 0})\``
            });
        }
         let embed = new MessageEmbed().setAuthor(uye.user.tag, uye.user.avatarURL({dynamic: true, size: 2048})).setThumbnail(uye.user.avatarURL({dynamic: true, size: 2048})).setColor(ayarlar.embed.renk).setFooter(ayarlar.embed.altbaşlık).setDescription(`${uye} (${uye.roles.highest}) kullanıcısının yetki yükseltim bilgileri aşağıda belirtilmiştir.`)
        .addFields(
            { name: `${message.guild.emojis.cache.get(emojiler.Terfi.icon)} Puan Durumu`, value: `Ödül: \`${puanBelirt}\` ${message.guild.emojis.cache.get(emojiler.Görev.Para)}\nPuanınız: \`${puanBilgisi.Point.toFixed(1)}\` Gereken Puan: \`${Number(puanBelirt-puanBilgisi.Point).toFixed(1)}\`\n${puanBari}`},
            { name: `${message.guild.emojis.cache.get(emojiler.Terfi.icon)} Puan Detayları`, value: `${message.guild.emojis.cache.get(emojiler.Terfi.miniicon)} Kayıtlar: \`${teyitoku ? teyitoku.Toplamteyit ? teyitoku.Toplamteyit : 0 : 0} adet (Puan Etkisi: +${puanBilgisi ? puanBilgisi.Register : 0})\`
${message.guild.emojis.cache.get(emojiler.Terfi.miniicon)} Taglılar: \`${taglıÇek} adet (Puan Etkisi: +${puanBilgisi ? puanBilgisi.Tag : 0})\`
${message.guild.emojis.cache.get(emojiler.Terfi.miniicon)} Davetler: \`${davetbilgisi.regular} (Puan Etkisi: +${puanBilgisi ? puanBilgisi.Invite : 0})\`
${message.guild.emojis.cache.get(emojiler.Terfi.miniicon)} Bonus: \`${puanBilgisi ? puanBilgisi.Bonus : 0} (Puan Etkisi: +${puanBilgisi ? puanBilgisi.Bonus : 0})\`
${simdimesaj}
${simdises}`},
{ name: `${message.guild.emojis.cache.get(emojiler.Terfi.icon)} Yetki Durumu`, value: yetkidurumu }
        )

        let genelpuandurumu = new MessageEmbed().setAuthor(uye.user.tag, uye.user.avatarURL({dynamic: true, size: 2048})).setThumbnail(uye.user.avatarURL({dynamic: true, size: 2048})).setColor(ayarlar.embed.renk).setFooter(ayarlar.embed.altbaşlık).setDescription(`${uye} (${uye.roles.highest}) kullanıcısının \`${tarihsel(puanBilgisi.Baslama)}\` tarihinden itibaren kazandığı toplam puanlar ve detayları aşağıda belirtilmiştir.`).addFields(
            { name: `${message.guild.emojis.cache.get(emojiler.Terfi.icon)} Genel Puan Durumu`, value: `Toplam Puanınız: \`${puanBilgisi.ToplamPuan.toFixed(1)}\` Toplam Kalan Puan: \`${Number(ToplamPuan-puanBilgisi.ToplamPuan).toFixed(1)}\`\n${genelpuanBari}`},
            { name: `${message.guild.emojis.cache.get(emojiler.Terfi.icon)} Genel Puan Detayları`, value: `${message.guild.emojis.cache.get(emojiler.Terfi.miniicon)} Kayıt: \`${teyitbilgi}\`
${message.guild.emojis.cache.get(emojiler.Terfi.miniicon)} Taglı: \`+${taglıÇek*uPConf.odül.taglı} Puan\`
${message.guild.emojis.cache.get(emojiler.Terfi.miniicon)} Davet: \`+${davetbilgisi.regular*uPConf.odül.invite} Puan\`
${message.guild.emojis.cache.get(emojiler.Terfi.miniicon)} Ceza-i Durum: \`${cezapuanoku} (Ceza Etkisi: -${cezapuanoku > 5 ? cezapuanoku/2 : cezapuanoku})\`
${message.guild.emojis.cache.get(emojiler.Terfi.miniicon)} Toplam Bonus: \`+${puanBilgisi ? puanBilgisi.ToplamBonus : 0} Puan\`
${message.guild.emojis.cache.get(emojiler.Terfi.miniicon)} Toplam Ses: \`+${puanBilgisi ? puanBilgisi.ToplamSes.toFixed(1) : 0} Puan\`
${message.guild.emojis.cache.get(emojiler.Terfi.miniicon)} Toplam Mesaj: \`+${puanBilgisi ? puanBilgisi.ToplamMesaj.toFixed(1) : 0} Puan\``},
{ name: `${message.guild.emojis.cache.get(emojiler.Terfi.icon)} Genel Ses Detayı`, value: `${siralases ? siralases : `${message.guild.emojis.cache.get(emojiler.Iptal)} Maalesef genel ses puan detayları bulunamadığından listelenemedi.`}`},
{ name: `${message.guild.emojis.cache.get(emojiler.Terfi.icon)} Yetki Durumu`, value: `Şu an <@&${eskiRol.rol}> rolünden, son ${message.guild.roles.cache.get(uPConf.sonyetki) ? message.guild.roles.cache.get(uPConf.sonyetki) : "@Rol Bulunamadı."} rolüne ulaşabilmek için \`${Number(ToplamPuan-puanBilgisi.ToplamPuan).toFixed(1)}\` puan kazanmanız gerekiyor, şuan da \`%${Math.floor((puanBilgisi.ToplamPuan)/ToplamPuan*100)}\` oranında tamamladınız.`}
      )

      var button_1 = new MessageButton().setID("buttonana").setLabel("Puan Detayları").setEmoji(emojiler.uyeEmojiID, true).setStyle("green");
      var button_2 = new MessageButton().setID("buttongenel").setLabel("Genel Puan Detayları").setEmoji(emojiler.Terfi.icon, true).setStyle("blurple");
      var button_3 = new MessageButton().setID("buttoniptal").setLabel("İptal").setEmoji(emojiler.Iptal, true).setStyle("red");
  
      let msg = await message.channel.send({ buttons : [ button_1, button_2, button_3 ], embed: embed })
      var filter = (button) => button.clicker.user.id === message.member.id;
      let collector = await msg.createButtonCollector(filter, { time: 30000 })

      collector.on("collect", async (button) => {
        if(button.id === "buttonana") {
            msg.edit(embed)
            await button.reply.think(true)
            await button.reply.edit(`Puan detayları gösteriliyor.`)
        }
        if(button.id === "buttongenel") {
            msg.edit(genelpuandurumu)
            await button.reply.think(true)
            await button.reply.edit(`Sunucu boyu Genel Puan detayları gösteriliyor.`)
        }
        if(button.id === "buttoniptal") {
            msg.delete()
        }
      });

      collector.on("end", async () => {
        msg.delete().catch(x => {})
      });

        function progressBar(value, maxValue, size, veri) {
            const progress = Math.round(size * ((value / maxValue) > 1 ? 1 : (value / maxValue)));
            const emptyProgress = size - progress > 0 ? size - progress : 0;
            let progressStart;
            if(veri == 0) progressStart = `${message.guild.emojis.cache.get(emojiler.Terfi.başlangıçBar)}`
            if(veri > 0) progressStart = `${message.guild.emojis.cache.get(emojiler.Terfi.başlamaBar)}`
            const progressText = `${message.guild.emojis.cache.get(emojiler.Terfi.doluBar)}`.repeat(progress);
            const emptyProgressText = `${message.guild.emojis.cache.get(emojiler.Terfi.boşBar)}`.repeat(emptyProgress)
            const bar = progressStart + progressText + emptyProgressText + `${emptyProgress == 0 ? `${message.guild.emojis.cache.get(emojiler.Terfi.doluBitişBar)}` : `${message.guild.emojis.cache.get(emojiler.Terfi.boşBitişBar)}`}`;
            return bar;
        };
   });
  }
};