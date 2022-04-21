const { Client, Message, MessageEmbed } = require("discord.js");

const AuditRoles = require('../../../Database/Schema/AuditRoles')
module.exports = {
    Isim: "rollog",
    Komut: ["rollog","rolgeçmişi"],
    Kullanim: "rollog @sehira/ID",
    Aciklama: "Bir üyenin rol geçmişini görüntüler.",
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
   */

  onRequest: async function (client, message, args) {
    const embed = new MessageEmbed()
    .setAuthor(ayarlar.embed.başlık, message.guild.iconURL({dynamic: true}))
    .setColor(ayarlar.embed.renk)
    .setFooter(ayarlar.embed.altbaşlık)
    if(!roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(cevaplar.noyt); 
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!uye) return message.channel.send(`${cevaplar.prefix} __Hata__: Rol geçmişini görüntülüyebilmem için lütfen bir üye etiketle __Örn:__ \`${sistem.prefix}${module.exports.Isim} @acar/ID\`!`).then(x => x.delete({timeout: 5000}));
    if(uye.user.bot) return message.channel.send(cevaplar.bot); 
    let currentPage = 1; 
    AuditRoles.findOne({ user: uye.id }, async (err, res) => {
        if (!res) return message.channel.send(`${cevaplar.prefix} __Hata__: ${uye} \`üyenin rol bilgisi veritabanında bulunmadı.\``).then(x => x.delete({timeout: 7500}));
        let pages = res.roller.filter(x => !(roller.kayıtsızRolleri.some(r => r == x.rol) 
        || roller.kadınRolleri.some(r => r == x.rol)
        || roller.erkekRolleri.some(r => r == x.rol) 
        || roller.tagRolü == x.rol
        || roller.jailRolü  == x.rol
        ||  roller.şüpheliRolü == x.rol
        ||  roller.yasaklıTagRolü == x.rol
        ||  roller.muteRolü == x.rol
        ||  roller.voicemuteRolü  == x.rol
        ||  roller.boosterRolü == x.rol)
          
    ).sort((a, b) => b.tarih - a.tarih).chunk(20);
        if (!pages.length || !pages[currentPage - 1].length) return message.channel.send(`${cevaplar.prefix} __Hata__: \`Belirtilen üyenin rol geçmişi bulunamadı.\``).then(x => x.delete({timeout: 7500}));
        let msg = await message.channel.send(embed.setDescription(`${message.guild.emojiGöster(emojiler.Tag)} ${uye} üyesinin rol geçmişi yükleniyor... Lütfen bekleyin.`));
        let reactions = ["◀", "❌", "▶"];
        for (let reaction of reactions) await msg.react(reaction);
            if (msg) await msg.edit(embed.setDescription(`${pages[currentPage - 1].map((x) => `\`${x.state == "Ekleme" ? "✅" : "❌"}\` <@&${x.rol}> (\`${tarihsel(x.tarih)}\`) (<@${x.mod ? x.mod : "Bilinmeyen Yetkili"}>)`).join("\n")}`))

        const back = msg.createReactionCollector((reaction, user) => reaction.emoji.name == "◀" && user.id == message.author.id,
        { time: 20000 }),
      x = msg.createReactionCollector((reaction, user) => reaction.emoji.name == "❌" && user.id == message.author.id, 
        { time: 20000 }),
      go = msg.createReactionCollector((reaction, user) => reaction.emoji.name == "▶" && user.id == message.author.id,
        { time: 20000 });
    back.on("collect", async reaction => {
      await reaction.users.remove(message.author.id).catch(err => {});
      if (currentPage == 1) return;
      currentPage--;
      if (msg) msg.edit(embed.setDescription(`${pages[currentPage - 1].map((x) => `\`${x.state == "Ekleme" ? "✅" : "❌"}\` <@&${x.rol}> (\`${tarihsel(x.tarih)}\`) (<@${x.mod ? x.mod : "Bilinmeyen Yetkili"}>)`).join("\n")}`))
    });
    go.on("collect", async reaction => {
      await reaction.users.remove(message.author.id).catch(err => {});
      if (currentPage == pages.length) return;
      currentPage++;
      if (msg) msg.edit(embed.setDescription(`${pages[currentPage - 1].map((x) => `\`${x.state == "Ekleme" ? "✅" : "❌"}\` <@&${x.rol}> (\`${tarihsel(x.tarih)}\`) (<@${x.mod ? x.mod : "Bilinmeyen Yetkili"}>)`).join("\n")}`))
    });
    x.on("collect", async reaction => {
      await back.stop();
      await go.stop();
      await x.stop();
      if (message) message.delete().catch(err => {});
      if (msg) return msg.delete().catch(err => {});
    });
    back.on("end", async () => {
      await back.stop();
      await go.stop();
      await x.stop();
      if (message) message.delete().catch(err => {});
      if (msg) return msg.delete().catch(err => {});
    });
    })
 }
};