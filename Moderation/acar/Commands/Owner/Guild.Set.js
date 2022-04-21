const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
    Isim: "sunucu",
    Komut: ["guild"],
    Kullanim: "Sunucunun resmini, afişini ve ismini değiştirebilirsiniz.",
    Aciklama: "",
    Kategori: "",
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
    let embed = new MessageEmbed().setAuthor(ayarlar.embed.başlık, message.guild.iconURL({dynamic: true, size: 2048})).setFooter(ayarlar.embed.altbaşlık).setColor(ayarlar.embed.renk);
    if(!sistem.staff.find(x => x.id == message.member.id) && !message.member.hasPermission('ADMINISTRATOR') && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku))) return message.channel.send(cevaplar.noyt);
    let process = ["isim","afiş","resim", "kanal-oluştur"]
    if(!process.some(x => args[0] == x)) return message.channel.send(cevaplar.argümandoldur + ` \`${sistem.prefix}${module.exports.Isim} <${process.map(x => x).join("/")}> <Yeni İçerik>\``);
    if(args[0] == "isim") {
      if(!args[1]) return message.channel.send(`${cevaplar.prefix} Lütfen bir sunucu ismi belirleyin.`).then(x => setTimeout(() => { x.delete() }, 7500));
      message.react(emojiler.Onay)
      return setName(message.guild, message.member, message.channel, args.slice(1).join(" "), message.guild.name, embed);
    }
    if(args[0] == "afiş") {
      message.react(emojiler.Onay)
      return setBanner(message.guild, message.member, message.channel, args.slice(1).join(" ") || message.attachments.first().url, message.guild.bannerURL({dynamic: true, format: "png"}), embed);
    }
    if(args[0] == "resim") {
      message.react(emojiler.Onay)
      return setIcon(message.guild, message.member, message.channel, args.slice(1).join(" ") || message.attachments.first().url, message.guild.iconURL({dynamic: true, format: "png"}), embed);
    }
    if(args[0] == "kanal-oluştur") {
        if(!args[1]) return message.channel.send(cevaplar.argümandoldur + ` \`${sistem.prefix}${module.exports.Isim} kanal-oluştur <ses-metin-kategori> <İsim> <Kategori>\``);
        if(!args[2]) return message.channel.send(cevaplar.argümandoldur + ` \`${sistem.prefix}${module.exports.Isim} kanal-oluştur <ses-metin-kategori> <İsim> <Kategori>\``);
        message.guild.channels.create(args[2], {
            type: args[1].replace("ses", "voice").replace("metin","text").replace("kategori","category"), 
            permissionOverwrites: [
               {
                 id: message.guild.roles.everyone,
                 deny: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'] 
               },
               {
                id: message.member.id,
                allow: ['MENTION_EVERYONE','USE_EXTERNAL_EMOJIS','MANAGE_ROLES','CREATE_INSTANT_INVITE','EMBED_LINKS','SEND_TTS_MESSAGES','VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'MANAGE_CHANNELS','MANAGE_MESSAGES','CONNECT','STREAM','MOVE_MEMBERS','MUTE_MEMBERS','USE_VAD','PRIORITY_SPEAKER','DEAFEN_MEMBERS','ATTACH_FILES','ADD_REACTIONS'] 
              }
            ],
          }).then(x => {
              createChannel(message.guild, message.member, message.channel,  args[2], args[1].replace("ses", "voice").replace("metin","text").replace("kategori","category"), embed)
               message.react(emojiler.Onay)
               if(args[3]) x.setParent(args[3]).then(x => {
                 message.channel.send(`${message.guild.emojiGöster(emojiler.Onay)} Başarıyla \`${args[2]}\` ismindeki kanalı \`${message.guild.channels.cache.get(args[3]).name}\` kategorisine taşıdım.`).then(x => {x.delete({timeout: 5000})})
               })
            })
    }
  }
};


async function setIcon(guild, member, channel, newIcon, oldIcon, embed) {
  await guild.setBanner(newIcon).catch(err => {})
  guild.kanalBul("guild-log").send(embed.setDescription(`${member} (\`${member.id}\`)  isimli yönetici sunucu resmini değiştirdi.`).setThumbnail(oldIcon).setImage(newIcon))
  guild.owner.send(embed.setDescription(`${member} (\`${member.id}\`)  isimli yönetici sunucu resmini değiştirdi.`).setThumbnail(oldIcon).setImage(newIcon)).catch(x => {})
  sistem.staff.forEach(staff => {
    let botOwner = guild.members.cache.get(staff.id);
    if(botOwner) botOwner.send(embed.setDescription(`${member} (\`${member.id}\`) isimli yönetici sunucu resmini değiştirdi.`).setThumbnail(oldIcon).setImage(newIcon)).catch(x => {})
  });
  await channel.send(`${guild.emojis.cache.get(emojiler.Onay)} Başarıyla sunucu resimi değiştirildi.`).then(x => {
    x.delete({timeout: 8500})
  })
}


async function setBanner(guild, member, channel, newBanner, oldBanner, embed) {
  await guild.setBanner(newBanner).catch(err => {})
  guild.kanalBul("guild-log").send(embed.setDescription(`${member} (\`${member.id}\`)  isimli yönetici sunucu afişini değiştirdi.`).setThumbnail(oldBanner).setImage(newBanner))
  guild.owner.send(embed.setDescription(`${member} (\`${member.id}\`)  isimli yönetici sunucu afişini değiştirdi.`).setThumbnail(oldBanner).setImage(newBanner)).catch(x => {})
  sistem.staff.forEach(staff => {
    let botOwner = guild.members.cache.get(staff.id);
    if(botOwner) botOwner.send(embed.setDescription(`${member} (\`${member.id}\`) isimli yönetici sunucu afişini değiştirdi.`).setThumbnail(oldBanner).setImage(newBanner)).catch(x => {})
  });
  await channel.send(`${guild.emojis.cache.get(emojiler.Onay)} Başarıyla sunucu afişi değiştirildi.`).then(x => {
    x.delete({timeout: 8500})
  })
}


async function setName(guild, member, channel, newName, oldName, embed) {
  await guild.setName(newName).catch(err => {})
  guild.kanalBul("guild-log").send(embed.setDescription(`${member} (\`${member.id}\`) isimli yönetici sunucu ismini \`${oldName}\` => \`${newName}\` olarak değiştirdi.`))
  guild.owner.send(embed.setDescription(`${member} (\`${member.id}\`) isimli yönetici sunucu ismini \`${oldName}\` => \`${newName}\` olarak değiştirdi.`)).catch(x => {})
  sistem.staff.forEach(staff => {
    let botOwner = guild.members.cache.get(staff.id);
    if(botOwner) botOwner.send(embed.setDescription(`${member} (\`${member.id}\`) isimli yönetici sunucu ismini \`${oldName}\` => \`${newName}\` olarak değiştirdi.`)).catch(x => {})
  });
  await channel.send(`${guild.emojis.cache.get(emojiler.Onay)} Başarıyla sunucu ismi \`${oldName}\` => \`${newName}\` olarak değiştirildi.`).then(x => {
    x.delete({timeout: 8500})
  })
}

async function createChannel(guild, member, channel, newChannelName, type, embed) {
  guild.kanalBul("guild-log").send(embed.setDescription(`${member} (\`${member.id}\`)  isimli yönetici sunucu içerisinde \`${newChannelName}\` isminde bir \`${type ? type == "voice" ? "Ses Kanalı" : type == "text" ? "Metin Kanalı" : type == "category" ? "Kategori" : "" : ""}\` oluşturdu.`)).catch(err => {})
  guild.owner.send(embed.setDescription(`${member} (\`${member.id}\`)  isimli yönetici sunucu içerisinde \`${newChannelName}\` isminde bir \`${type ? type == "voice" ? "Ses Kanalı" : type == "text" ? "Metin Kanalı" : type == "category" ? "Kategori" : "" : ""}\` oluşturdu.`)).catch(err => {})
  sistem.staff.forEach(staff => {
    let botOwner = guild.members.cache.get(staff.id);
    if(botOwner) botOwner.send(embed.setDescription(`${member} (\`${member.id}\`)  isimli yönetici sunucu içerisinde \`${newChannelName}\` isminde bir \`${type ? type == "voice" ? "Ses Kanalı" : type == "text" ? "Metin Kanalı" : type == "category" ? "Kategori" : "" : ""}\` oluşturdu.`)).catch(err => {})
  });
  await channel.send(`${guild.emojis.cache.get(emojiler.Onay)} Başarıyla \`${newChannelName}\` isminde \`${type ? type == "voice" ? "Ses Kanalı" : type == "text" ? "Metin Kanalı" : type == "category" ? "Kategori" : "" : ""}\` oluşturdu.`).then(x => {
    x.delete({timeout: 8500})
  })
}