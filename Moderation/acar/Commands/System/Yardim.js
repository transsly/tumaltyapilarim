const { Client, Message, MessageEmbed} = require("discord.js");

module.exports = {
    Isim: "yardım",
    Komut: ["yardim", "help"],
    Kullanim: "",
    Aciklama: "",
    Kategori: "-",
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
    let command = args[0]
    let embed2 = new MessageEmbed().setAuthor(ayarlar.embed.başlık, message.guild.iconURL({dynamic: true, size: 2048})).setColor(ayarlar.embed.renk).setFooter(ayarlar.embed.altbaşlık)
     if (client.komutlar.has(command)) {
  
    command = client.komutlar.get(command)
    embed2
    .addField(`\`\`\`Komut Adı\`\`\``,`
${command.Isim}
      `,true)
      .addField(`\`\`\`Komut Açıklaması\`\`\``,`
${command.Aciklama}
      `,false)
      .addField(`\`\`\`Komut Kullanımı\`\`\``,`
${command.Kullanim}
      `,true)
      .addField(`\`\`\`Komut Alternatifleri\`\`\``,`
${command.Komut[0] ? command.Komut.join(', ') : 'Bulunmuyor'}
      `,true)
      .setColor(ayarlar.embed.renk)
    message.channel.send(embed2).then(msg => {
  msg.react(emojiler.Iptal)
  .then(r1 => {
     const cancelFilter1 = (reaction, user) => reaction.emoji.id === emojiler.Iptal && user.id === message.author.id;
      const cancel1 = msg.createReactionCollector(cancelFilter1, { time: 100000 });
      cancel1.on('collect', r1 => {
    message.channel.send(new MessageEmbed().setAuthor(ayarlar.embed.başlık, message.guild.iconURL({dynamic: true, size: 2048})).setFooter(ayarlar.embed.altbaşlık).setColor(ayarlar.embed.renk).setDescription(`Başarılı: **${args[0]}** adlı komut bilgisi istek üzerine kapatıldı.`)).then(x =>  x.delete({timeout: 5000}) | x.react("✅"));
        msg.delete();
      })
     })
  });
  return;
}



let sayfalar = [client.komutlar.filter(x => x.Kategori !== "-" && x.Kategori == "Misc" ).map(x => sistem.prefix + x.Kullanim ).join('\n'),
client.komutlar.filter(x => x.Kategori !== "-" && x.Kategori == "Register" ).map(x => sistem.prefix + x.Kullanim ).join('\n'),
client.komutlar.filter(x => x.Kategori !== "-" && x.Kategori == "Moderation" ).map(x => sistem.prefix + x.Kullanim ).join('\n'),
client.komutlar.filter(x => x.Kategori !== "-" && x.Kategori == "Yönetim" ).map(x => sistem.prefix + x.Kullanim ).join('\n'),
client.komutlar.filter(x => x.Kategori !== "-" && x.Kategori == "Stat" ).map(x => sistem.prefix + x.Kullanim ).join('\n'),
client.komutlar.filter(x => x.Kategori !== "-" && x.Kategori == "Economy" ).map(x => sistem.prefix + x.Kullanim).join('\n'),
roller.talentPerms.map(x => sistem.prefix + x.Commands[0] + " <@acar/ID>").join('\n')
];
let başlık = ["Üye Komutları","Teyit Komutları","Moderasyon Komutları","Yönetim Komutları","İstatistik Komutları","Ekonomi Komutları","Diğer Komutlar"] 
let sayfa = 1; 
let embed = new MessageEmbed().setAuthor(ayarlar.embed.başlık + ` - Yardım Menüsü`, message.guild.iconURL({dynamic: true, size: 2048}))
.setColor(ayarlar.embed.renk)
.setTitle(başlık[sayfa-1]) 
.setDescription(`\`${sayfalar[sayfa-1]}\``)
.setFooter(ayarlar.embed.altbaşlık + ` • Sayfa ${sayfa}/${sayfalar.length}`) 

message.channel.send(embed).then(msg => { 
   
  msg.react('⏪').then( r => {
    msg.react('❌') 
    msg.react('⏩') 
   
    const backwardsFilter = (reaction, user) => reaction.emoji.name === '⏪' && user.id === message.author.id;
    const endFilter = (reaction, user) => reaction.emoji.name === '❌' && user.id === message.author.id;
    const forwardsFilter = (reaction, user) => reaction.emoji.name === '⏩' && user.id === message.author.id; 
   
    const backwards = msg.createReactionCollector(backwardsFilter, { time: 60000 })
    const ends = msg.createReactionCollector(endFilter, {  time: 60000 });  
    const forwards = msg.createReactionCollector(forwardsFilter, { time: 60000 }); 
   
    
    backwards.on('collect', async (r) => { 
      await r.users.remove(message.author.id).catch(err => {}); 
      if (sayfa === 1) return;
      sayfa--;
      embed.setTitle(başlık[sayfa-1]) 
      embed.setDescription(`\`${sayfalar[sayfa-1]}\``);
      embed.setFooter(ayarlar.embed.altbaşlık + ` • Sayfa ${sayfa}/${sayfalar.length}`) 
      msg.edit(embed) 
    })
   
    forwards.on('collect', async (r) => { 
      await r.users.remove(message.author.id).catch(err => {});  
      if (sayfa === sayfalar.length) return;
      sayfa++;
      embed.setTitle(başlık[sayfa-1])  
      embed.setDescription(`\`${sayfalar[sayfa-1]}\``);
      embed.setFooter(ayarlar.embed.altbaşlık + ` • Sayfa ${sayfa}/${sayfalar.length}`)  
      msg.edit(embed) 
    })

    ends.on('collect', async (r) => {
     await message.delete() 
     await msg.delete()
     await message.channel.send(`${message.guild.emojiGöster(emojiler.Onay)} Yardım menüsü istek üzerine kapatıldı.`).then(x => {  
      x.delete({timeout: 5000})})
    })
 
  })

})
    }
};
