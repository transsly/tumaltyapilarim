const { Client, Message, MessageEmbed, Guild } = require("discord.js");
const fetch = require('node-fetch')
const { MessageButton } = require('discord-buttons');
module.exports = {
    Isim: "etkinlik",
    Komut: ["aktivite"],
    Kullanim: "etkinlik <yt-pn-bio-fio>",
    Aciklama: "Seste etkinlik yapmanızı sağlar.",
    Kategori: "Misc",
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
    message.delete()
    var button_1 = new MessageButton().setID("youtubetogether").setLabel("Youtube Together").setEmoji('862777652200472586', true).setStyle("gray");
    var button_2 = new MessageButton().setID("pokernight").setLabel("Poker Night").setEmoji('862777479524515870', true).setStyle("green");
    var button_3 = new MessageButton().setID("betrayalio").setLabel("Betrayal.io").setEmoji('862777902239842364', true).setStyle("green");
    var button_4 = new MessageButton().setID("fishington").setLabel("Fishington.io").setEmoji('862778117130682399', true).setStyle("green");
    var button_5 = new MessageButton().setID("chess").setLabel("Chess").setEmoji('862779350591733781', true).setStyle("green");
    if(!message.member.voice) return message.channel.send("Hata: `Lütfen bir ses kanalına bağlanın.!`").then(x => x.delete({timeout: 5000}));

    let msg = await message.channel.send(`Aşağıda ki düğmelerden istediğiniz etkinlik çeşitini seçin.`,{ buttons : [ button_1, button_2, button_3, button_4, button_5 ]})
    var filter = (button) => button.clicker.user.id === message.member.id;
    let collector = await msg.createButtonCollector(filter, { time: 30000 })
    collector.on("collect", async (button) => {
            msg.delete();
            if(button.id === "chess") {
                fetch(`https://discord.com/api/v8/channels/${message.member.voice.channelID}/invites`, {
                    method: "POST",
                    body: JSON.stringify({
                        max_age: 86400,
                        max_uses: 0,
                        target_application_id: "832012586023256104",
                        target_type: 2,
                        temporary: false,
                        validate: null
                    }),
                    headers: {
                        "Authorization": `Bot ${sistem.MODTOKEN}`,
                        "Content-Type": "application/json"
                    }
                })
                .then(res => res.json())
                .then(async (invite) => {
                    await button.reply.think(true)
                    await button.reply.edit(`${message.guild.emojiGöster(emojiler.Onay)} (\`${message.member.voice.channel.name}\`) [Etkinliğe Katıl](https://discord.gg/${invite.code}) `)
                })
            }
            if(button.id === "youtubetogether") {
                fetch(`https://discord.com/api/v8/channels/${message.member.voice.channelID}/invites`, {
                    method: "POST",
                    body: JSON.stringify({
                        max_age: 86400,
                        max_uses: 0,
                        target_application_id: "755600276941176913",
                        target_type: 2,
                        temporary: false,
                        validate: null
                    }),
                    headers: {
                        "Authorization": `Bot ${sistem.MODTOKEN}`,
                        "Content-Type": "application/json"
                    }
                })
                .then(res => res.json())
                .then(async (invite) => {
                    await button.reply.think(true)
                    await button.reply.edit(`${message.guild.emojiGöster(emojiler.Onay)} (\`${message.member.voice.channel.name}\`) [Etkinliğe Katıl](https://discord.gg/${invite.code}) `)
                })
            }
            if(button.id === "pokernight") {
                fetch(`https://discord.com/api/v8/channels/${message.member.voice.channelID}/invites`, {
                    method: "POST",
                    body: JSON.stringify({
                        max_age: 86400,
                        max_uses: 0,
                        target_application_id: "755827207812677713",
                        target_type: 2,
                        temporary: false,
                        validate: null
                    }),
                    headers: {
                        "Authorization": `Bot ${sistem.MODTOKEN}`,
                        "Content-Type": "application/json"
                    }
                })
                .then(res => res.json())
                .then(async (invite) => {
                    await button.reply.think(true)
                    await button.reply.edit(`${message.guild.emojiGöster(emojiler.Onay)} (\`${message.member.voice.channel.name}\`) [Etkinliğe Katıl](https://discord.gg/${invite.code}) `)
        })
            }
            if(button.id === "betrayalio") {
                fetch(`https://discord.com/api/v8/channels/${message.member.voice.channelID}/invites`, {
                    method: "POST",
                    body: JSON.stringify({
                        max_age: 86400,
                        max_uses: 0,
                        target_application_id: "773336526917861400",
                        target_type: 2,
                        temporary: false,
                        validate: null
                    }),
                    headers: {
                        "Authorization": `Bot ${sistem.MODTOKEN}`,
                        "Content-Type": "application/json"
                    }
                })
                .then(res => res.json())
                .then(async (invite) => {
                    await button.reply.think(true)
                    await button.reply.edit(`${message.guild.emojiGöster(emojiler.Onay)} (\`${message.member.voice.channel.name}\`) [Etkinliğe Katıl](https://discord.gg/${invite.code}) `)
                })
            }
            if(button.id === "fishington") {
                fetch(`https://discord.com/api/v8/channels/${message.member.voice.channelID}/invites`, {
                    method: "POST",
                    body: JSON.stringify({
                        max_age: 86400,
                        max_uses: 0,
                        target_application_id: "814288819477020702",
                        target_type: 2,
                        temporary: false,
                        validate: null
                    }),
                    headers: {
                        "Authorization": `Bot ${sistem.MODTOKEN}`,
                        "Content-Type": "application/json"
                    }
                })
                .then(res => res.json())
                .then(async (invite) => {
                    await button.reply.think(true)
                    await button.reply.edit(`${message.guild.emojiGöster(emojiler.Onay)} (\`${message.member.voice.channel.name}\`) [Etkinliğe Katıl](https://discord.gg/${invite.code}) `)
                })
            }
      });
  
      collector.on("end", async () => {
          msg.delete().catch(x => {})
      });   
    }
};