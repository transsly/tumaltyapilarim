const { Client, Message, Guild, MessageEmbed } = require("discord.js");
const { MessageButton } = require('discord-buttons');
module.exports = {
    Isim: "rol",
    Komut: ["r"],
    Kullanim: "rol <ver-al-liste> <Rol-Id>",
    Aciklama: "Belirlenen üyeye belirlenen rolü verip almak için kullanılır!",
    Kategori: "Yönetim",
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
   * @param {Guild} guild
   */
  onRequest: async function (client, message, args, guild) {
    let embed = new MessageEmbed().setAuthor(ayarlar.embed.başlık, message.guild.iconURL({dynamic: true})).setColor(ayarlar.embed.renk)
    let kullanici = message.mentions.users.first() || message.guild.members.cache.get(args[1])
    let x = message.guild.member(kullanici);
    let rol = message.mentions.roles.first() || message.guild.roles.cache.get(args[2]) || message.guild.roles.cache.find(a => a.name == args.slice(2).join(' '));
    if(!roller.roleManager.some(oku => message.member.roles.cache.has(oku)) && !roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(cevaplar.noyt); 
    if(args[0] !== "ver" && args[0] !== "al" && args[0] !== "liste") return message.channel.send(`${cevaplar.prefix} Bir üyeye rol verip almak için lütfen __argümanları__ doldurun Örn: \`.rol ver/al/liste @sehira/ID <EtiketRol/RolID>\``).then(x => x.delete({timeout: 5000}));
    if(!kullanici && args[0] != "liste") return message.channel.send(`${cevaplar.üye} \`.rol ver/al/liste @sehira/ID <EtiketRol/RolID>\``).then(x => x.delete({timeout: 5000}));
    if(!rol && args[0] != "liste") return message.channel.send(`${cevaplar.prefix} Bir üyeye rol verip almak için lütfen __argümanları__ doldurun Örn: \`.rol ver/al/liste @acar/ID <EtiketRol/RolID>\``).then(x => x.delete({timeout: 5000}));
    if (rol && message.member.roles.highest.comparePositionTo(rol) < 1) {
      return message.channel.send(`${cevaplar.prefix} \`Vermek istediğiniz rol sizin rollerinizden üstün!\` hatası sebebiyle işlem yapılamadı!`).then(x => x.delete({timeout: 6000}));
    }
    if(args[0] === "liste") {
      try{
   let kullanılabilir = message.guild.roles.cache.filter(rol => !(roller.erkekRolleri.some(x => rol.id === x) ||
   roller.blokluRoller.some(roltara => rol.id === roltara) ||  
  roller.kadınRolleri.some(x => rol.id === x) ||
  rol.id === roller.boosterRolü ||
  rol.id === roller.vipRolü ||
  rol.id === roller.tagRolü ||
  roller.teyitciRolleri.some(x => rol.id === x) ||
  rol.id === roller.jailRolü ||
  rol.id === roller.şüpheliRolü ||
  rol.id === roller.yasaklıTagRolü ||
  rol.id === roller.muteRolü ||
  rol.id === roller.voicemuteRolü ||
  rol.id === roller.Katıldı ||
  roller.banHammer.some(x => rol.id === x) ||
  roller.jailHammer.some(x => rol.id === x) ||
  roller.voiceMuteHammer.some(x => rol.id === x) ||
  roller.muteHammer.some(x => rol.id === x) ||
  roller.teleportHammer.some(x => rol.id === x) ||
  roller.abilityHammer.some(x => rol.id === x) ||
  taskConf.yetkiler.some(x => rol.id === x) ||
  roller.üstYönetimRolleri.some(x => rol.id === x) ||
  roller.yönetimRolleri.some(x => rol.id === x) ||
  roller.altYönetimRolleri.some(x => rol.id === x) ||
  rol.id === roller.Monthly.One ||
  rol.id === roller.Monthly.Three ||
  rol.id === roller.Monthly.Six ||
  rol.id === roller.Monthly.Nine ||
  rol.id === roller.Monthly.Years ||
  uPConf.yetkiler.some(x => rol.id === x) ||
  roller.kayıtsızRolleri.some(x => rol.id === x)) && rol.name != `@everyone` && rol.name != `__________________` && !rol.permissions.has(8))
  message.channel.send(embed.setDescription(`Sadece aşağıda listelenmiş rolleri verebilir ve alabilirsin. (\`${kullanılabilir.size}\`) adet rol bulundu. \n\n${kullanılabilir.map(x => `${x} (\`${x.id}\`)`).join("\n")}`))
  return;
} catch (e) {
  console.log(e);
  message.channel.send('Hata: \`Sistemsel olarak hata oluştu lütfen @sehira yetkilisine başvurunuz\`!').then(x => x.delete({timeout: 5000}));
}
}
    if(roller.blokluRoller.some(roltara => rol.id === roltara) || 
    roller.erkekRolleri.some(x => rol.id === x) || 
    roller.kadınRolleri.some(x => rol.id === x) ||
    rol.id === roller.boosterRolü ||
    rol.id === roller.vipRolü ||
    rol.id === roller.tagRolü ||
    roller.teyitciRolleri.some(x => rol.id === x) ||
    rol.id === roller.jailRolü ||
    rol.id === roller.şüpheliRolü ||
    rol.id === roller.yasaklıTagRolü ||
    rol.id === roller.muteRolü ||
    rol.id === roller.voicemuteRolü ||
    rol.id === roller.Katıldı ||
    roller.banHammer.some(x => rol.id === x) ||
    roller.jailHammer.some(x => rol.id === x) ||
    roller.voiceMuteHammer.some(x => rol.id === x) ||
    roller.muteHammer.some(x => rol.id === x) ||
    roller.teleportHammer.some(x => rol.id === x) ||
    roller.abilityHammer.some(x => rol.id === x) ||
    taskConf.yetkiler.some(x => rol.id === x) ||
    roller.üstYönetimRolleri.some(x => rol.id === x) ||
    roller.yönetimRolleri.some(x => rol.id === x) ||
    roller.altYönetimRolleri.some(x => rol.id === x) ||
    rol.id === roller.Monthly.One ||
    rol.id === roller.Monthly.Three ||
    rol.id === roller.Monthly.Six ||
    rol.id === roller.Monthly.Nine ||
    rol.id === roller.Monthly.Years ||
    uPConf.yetkiler.some(x => rol.id === x) ||
    roller.kayıtsızRolleri.some(x => rol.id === x)) {
      return message.channel.send(`${cevaplar.prefix} \`(Özel Rol) Bu rolü vermezsin veya alamazsın!\` hatası sebebiyle işlem yapılamadı!`).then(x => x.delete({timeout: 6000}));
    }


    if(args[0] === "ver") {
      if(message.author.id === kullanici.id) return message.channel.send(cevaplar.kendi);
      try{
        
        await (x.roles.add(rol.id).catch())
              message.channel.send(`${message.guild.emojiGöster(emojiler.Onay)} ${kullanici} (\`${kullanici.id}\`) isimli üyeye \`${rol.name}\` adlı rolü __başarıyla__ verdin.`).then(x => x.delete({timeout: 5000}));
            message.guild.kanalBul("rol-log").send(embed.setDescription(`${message.author} (\`${message.author.id}\`) adlı yetkili ${rol} adlı rolü ${kullanici} (\`${kullanici.id}\`) kişisine verdi.`).setFooter(ayarlar.embed.altbaşlık))
              message.react(emojiler.Onay)
         } catch (e) {
            console.log(e);
            message.channel.send('Hata: \`Sistemsel olarak hata oluştu lütfen @sehira yetkilisine başvurunuz\`!').then(x => x.delete({timeout: 5000}));
          }
    };
  
    if(args[0] === "al") {
      if(message.author.id === kullanici.id) return message.channel.send(cevaplar.kendi);
      try{
        await (x.roles.remove(rol.id).catch())
        message.channel.send(`${message.guild.emojiGöster(emojiler.Onay)} ${kullanici} (\`${kullanici.id}\`) isimli üyeden \`${rol.name}\` adlı rolü __başarıyla__ aldın.`).then(x => x.delete({timeout: 5000}));
        message.guild.kanalBul("rol-log").send(embed.setDescription(`${message.author} (\`${message.author.id}\`) adlı üye ${rol} adlı rolü ${kullanici} (\`${kullanici.id}\`) kişisinden rolü geri aldı.`).setFooter(ayarlar.embed.altbaşlık))
        message.react(emojiler.Onay)
       
          } catch (e) {
            console.log(e);
            message.channel.send('Hata: \`Sistemsel olarak hata oluştu lütfen @sehira yetkilisine başvurunuz\`!').then(x => x.delete({timeout: 5000}));
          }
      }
    
  }
};