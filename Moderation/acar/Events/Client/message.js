const { Message, MessageEmbed } = require("discord.js");
const Users = require('../../../Database/Schema/Users');
const RoleLogs = require('../../../Database/Schema/AuditRoles');
const ms = require('ms');
const spamCommandCount = new Map()
client.bannedCommandUser = []
 /**
 * @param {Message} message 
 */

module.exports = async (message) => {
    
    //Gereksinimler Başlangıç
        let emojiler = global.emojiler
        let kanallar = global.kanallar
        let roller = global.roller
        let ayarlar = global.ayarlar
        let sistem = global.sistem
    //Gereksinimler Bitiş
     
    if (message.author.bot ||!sistem.prefixs.some(x => message.content.startsWith(x)) || !message.channel || message.channel.type == "dm") return;
    let args = message.content.substring(sistem.prefixs.some(x => x.length)).split(" ");
    let komutcuklar = args[0];
    let bot = message.client;
    args = args.splice(1);
    let calistirici;
    let TalentPerms = roller.talentPerms.find((kom) => kom.Commands.includes(komutcuklar))

    if([".tag", "!tag"].includes(message.content.toLowerCase())) return message.channel.send(`${ayarlar.etiket ? `\`${ayarlar.tag}\` ve \`#${ayarlar.etiketTag}\`` : `\`${ayarlar.tag}\``}`); 
    if([".link", "!link"].includes(message.content.toLowerCase())) return message.channel.send(message.guild.vanityURLCode ? `discord.gg/${message.guild.vanityURLCode}` : `discord.gg/${(await message.channel.createInvite()).code}`);

    if(bot.komut.has(komutcuklar) || bot.komutlar.has(komutcuklar) || TalentPerms) {
      if (client.bannedCommandUser.includes(message.author.id)) return;
      if (!sistem.staff.find(x => x.id == message.member.id) && !message.member.hasPermission('ADMINISTRATOR') && !message.member.roles.cache.has(roller.kurucuRolleri)) {
        let spamDedection = spamCommandCount.get(message.author.id) || []
        let cmd = { içerik: message.content, kanal: message.channel.name, komut: komutcuklar }
        spamDedection.push(cmd)
        spamCommandCount.set(message.author.id, spamDedection)
        if (spamDedection.length == 10) {
          message.channel.send(`${message.guild.emojiGöster(emojiler.ChatSusturuldu)} ${message.author} sürekli olarak komut kullanımı sebebiyle bot tarafından komut kullanımınız \`Devre-Dışı\` bırakıldı.`)
          message.guild.kanalBul("komut-log")
          .send(`${message.member} (\`${message.member.id}\`) üyesi \`${tarihsel(Date.now())}\` tarihinde sürekli komut kullanımından bot tarafından engellendi. 
\`\`\`Son kullanılan Komut: ${spamDedection.map(x => x.içerik).join("\n")}
Kullandığı komutlar: ${spamDedection.map(x => x.komut).join(",")}
Kullandığı kanallar: ${spamDedection.map(x => x.kanal).join(",")}\`\`\``)
          client.bannedCommandUser.push(message.author.id)
        }
  
        setTimeout(() => { if (spamCommandCount.has(message.author.id)) { spamCommandCount.delete(message.author.id) } }, ms("1m"))
      }

    
      if(ayarlar.bakımModu.SINGLEMAIN && !sistem.staff.find(x => x.id == message.member.id)) {
        if(ayarlar.bakımModu.KOMUTLAR.includes(komutcuklar)) return message.channel.send(`${message.guild.emojiGöster(emojiler.bakımEmojiID)} \`${komutcuklar}\` isimli komut **${ayarlar.bakımModu.BILGI ? ayarlar.bakımModu.BILGI : "Bakım Modu"}** sebepi ile \`Devre-Dışı\` bırakıldı.`)
      }
      if(ayarlar.bakımModu.MAIN && !sistem.staff.find(x => x.id == message.member.id)) return message.channel.send(`Bakım: \`${ayarlar.bakımModu.BILGI ? ayarlar.bakımModu.BILGI : "Bakım Modu"} sebepiyle komut kullanımları devre dışı.\``).then(x => x.delete({timeout: 7500}));
      if(message.member.roles.cache.has(roller.jailRolü) || message.member.roles.cache.has(roller.şüpheliRolü) || message.member.roles.cache.has(roller.yasaklıTagRolü) || (roller.kayıtsızRolleri && roller.kayıtsızRolleri.some(rol => message.member.roles.cache.has(rol)))) return;
      if(!kanallar.izinliKanallar.some(x => message.channel.id == x) && !message.member.hasPermission('ADMINISTRATOR') && !sistem.staff.find(x => x.id == message.member.id) && !["temizle","sil","snipe","afk","kilit", "s","slots","slot","coinflip","cf", "maden", "madenegit", "madengönder","bahis"].some(x => komutcuklar == x) ) return message.channel.send(`${cevaplar.prefix} Belirtilen komut bu kanalda kullanıma izin verilemiyor, lütfen ${message.guild.channels.cache.get(kanallar.izinliKanallar[0])} kanalında tekrar deneyin.`).then(x=> x.delete({timeout: 5000}));
      await Users.updateOne({ id: message.author.id }, { $push: { "Loglar": { Komut: komutcuklar, Kanal: message.channel.id, Tarih: Date.now() } } }, { upsert: true }).exec();
      bot.logger.log(`${message.author.tag} (${message.author.id}) komut kullandı "${komutcuklar}" kullandığı kanal "${message.channel.name}"`, "cmd");

      if(TalentPerms) {
        let embed = new MessageEmbed().setColor(ayarlar.embed.altbaşlık).setColor(ayarlar.embed.renk).setAuthor(ayarlar.embed.başlık, message.guild.iconURL({dynamic: true, size: 2048})).setFooter(ayarlar.embed.altbaşlık)
        var rolismi = TalentPerms.Name || "Belirsiz"
        let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if((TalentPerms.Permission && TalentPerms.Permission.length && !TalentPerms.Permission.some((id) => message.member.roles.cache.has(id))) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(cevaplar.noyt); 
        if (!uye) return message.channel.send(`${cevaplar.prefix} ${rolismi} rolü verebilmem için lütfen bir üyeyi etiketle __Örn:__ \`${sistem.prefix}${komutcuklar} @acar/ID\`!`).then(x => x.delete({timeout: 5000}));
        if (TalentPerms.Roles.some(role => uye.roles.cache.has(role))) {
          await RoleLogs.updateOne({ user: uye.id }, { $push: { "roller": { rol: TalentPerms.Roles, mod: message.author.id, tarih: Date.now(), state: "Kaldırma" } } }, { upsert: true }).exec() 
          uye.roles.remove(TalentPerms.Roles);
          message.channel.send(`${message.guild.emojiGöster(emojiler.Onay)} Başarıyla ${uye}, isimli üyeden **${rolismi}** rolü geri alındı.`).catch().then(x => x.delete({timeout: 7000}));
          message.react(emojiler.Onay)
          message.guild.kanalBul("yetenek-log").send(embed.setDescription(`${uye} isimli üyeden **${tarihsel(Date.now())}** tarihinde ${message.author} tarafından **${rolismi}** adlı rol geri alındı.`))
        }
        else  { 
          await RoleLogs.updateOne({ user: uye.id }, { $push: { "roller": { rol: TalentPerms.Roles, mod: message.author.id, tarih: Date.now(), state: "Ekleme" } } }, { upsert: true }).exec()
          uye.roles.add(TalentPerms.Roles); 
          message.channel.send(`${message.guild.emojiGöster(emojiler.Onay)} Başarıyla ${uye}, isimli üyeye **${rolismi}** rolü verildi.`).catch().then(x => x.delete({timeout: 7000}));
          message.react(emojiler.Onay)
          message.guild.kanalBul("yetenek-log").send(embed.setDescription(`${uye} isimli üyeye **${tarihsel(Date.now())}** tarihinde ${message.author} tarafından **${rolismi}** adlı rol verildi.`))  
        }
      }
      calistirici = bot.komut.get(komutcuklar) || bot.komutlar.get(komutcuklar);
      if(calistirici) calistirici.onRequest(bot, message, args);
    }
};

module.exports.config = {
    Event: "message"
};
