const { Client, Message, MessageEmbed} = require("discord.js");
const Coins = require('../../../Database/Schema/Coins');
const { MessageButton, MessageActionRow } = require('discord-buttons')
const Beklet = new Set();
module.exports = {
    Isim: "xox",
    Komut: ["tictactoe","ttt","xo"],
    Kullanim: "xox <@sehira/ID>",
    Aciklama: "X veya O olursunuz ve belirlediğiniz rakip ile kapışırsınız.",
    Kategori: "Economy",
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
    if(!kanallar.coinChat.some(x => message.channel.id == x) && !sistem.staff.find(x => x.id == message.member.id)) return message.channel.send(`${message.guild.emojiGöster(emojiler.Iptal)} Sadece ${kanallar.coinChat.map(x => message.guild.channels.cache.get(x)).join(",")} kanalların da oynayabilirsin.`).then(x => x.delete({timeout: 3500}));
    let embed = new MessageEmbed().setAuthor(ayarlar.embed.başlık, message.guild.iconURL({dynamic: true, size: 2048})).setColor(ayarlar.embed.renk);
    let opponent = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!opponent) return message.channel.send(cevaplar.prefix + ` TicTacToe oynamak için bir rakip belirlemelisin.`);
    if(opponent.id === message.member.id) return message.channel.send(cevaplar.prefix + ` Kendin ile karşılaşamazsın küçük çocuk.`);
    if(Beklet.has(message.member.id)) return message.channel.send(`${cevaplar.prefix} \`Oyunda olduğunuz için karşılaşma isteği gönderilemedi.\``).then(x => x.delete({timeout: 3000}));
    if(Beklet.has(opponent.id)) return message.channel.send(`${cevaplar.prefix} \`Rakibiniz oyunda olduğu için karşılaşma isteği gönderilemedi.\``).then(x => x.delete({timeout: 3000}));
    let fighters = [message.member.id, opponent.id]

    let GG = await Coins.findById(opponent.id)
    let GG_COIN = GG ? GG.Coin : 0
    let ME = await Coins.findById(message.member.id)
    let ME_COIN = ME ? ME.Coin : 0

    if(ME_COIN < 1000) return message.channel.send(`${cevaplar.prefix} ${opponent} üyesine \`Tic-Tac-Toe\` oyununda karşılaşmak için \`1000\` ${message.guild.emojis.cache.get(emojiler.Görev.Para)} ödemelisin.`).then(x => x.delete({timeout: 8500}));
    if(GG_COIN < 1000) return message.channel.send(`${cevaplar.prefix} ${message.member} rakibinin coini yetersiz olduğundan karşılaşma başlatılamadı.`).then(x => x.delete({timeout: 8500}));
    var button_1 = new MessageButton().setID("krs").setLabel("Karşılaş").setEmoji(emojiler.Görev.OK, true).setStyle("green");
    var button_2 = new MessageButton().setID("iptal").setLabel("Karşılaşma").setEmoji(emojiler.Iptal, true).setStyle("red");
      let msg1 = await message.channel.send(`${opponent},`,{ embed: embed.setDescription(`${message.guild.emojis.cache.get(emojiler.Tag)} ${message.member} ile \`Tic-Tac-Toe\` oyununda karşılaşmak istermisin?\nFakat bunun için (\`1.000\` ${message.guild.emojis.cache.get(emojiler.Görev.Para)}) ödeyeceksin ve bunun karşılığında (\`+2.499\` ${message.guild.emojis.cache.get(emojiler.Görev.Para)}) kazanacaksın.`), buttons : [ button_1, button_2 ] })
      var filter = (button) => button.clicker.user.id === opponent.id;
      let collector = await msg1.createButtonCollector(filter, { time: 30000 })

      collector.on("collect", async (button) => {
        if(button.id === "krs") {
            await button.reply.defer()
            msg1.delete();
            opponent.coinAdd(-1000);
        message.member.coinAdd(-1000);
        Beklet.add(message.author.id);
        Beklet.add(opponent.id);
    let Args = {
        user: 0,
        a1: {
            style: "gray",
            label: "➖",
            disabled: false
        },
        a2: {
            style: "gray",
            label: "➖",
            disabled: false
        },
        a3: {
            style: "gray",
            label: "➖",
            disabled: false
        },
        b1: {
            style: "gray",
            label: "➖",
            disabled: false
        },
        b2: {
            style: "gray",
            label: "➖",
            disabled: false
        },
        b3: {
            style: "gray",
            label: "➖",
            disabled: false
        },
        c1: {
            style: "gray",
            label: "➖",
            disabled: false
        },
        c2: {
            style: "gray",
            label: "➖",
            disabled: false
        },
        c3: {
            style: "gray",
            label: "➖",
            disabled: false
        }
    }
    let msg = await message.channel.send(`\`Tic-Tac-Toe\` <@!${Args.userid}> sıra sende (⭕)`)
    tictactoe(msg)
    async function tictactoe(m) {
        Args.userid=fighters[Args.user]
        let won = {
            "⭕": false,
            "❌": false
        }
        if (Args.a1.label == "⭕" && Args.b1.label == "⭕" && Args.c1.label == "⭕") won["⭕"] = true
        if (Args.a2.label == "⭕" && Args.b2.label == "⭕" && Args.c2.label == "⭕") won["⭕"] = true
        if (Args.a3.label == "⭕" && Args.b3.label == "⭕" && Args.c3.label == "⭕") won["⭕"] = true
        if (Args.a1.label == "⭕" && Args.b2.label == "⭕" && Args.c3.label == "⭕") won["⭕"] = true
        if (Args.a3.label == "⭕" && Args.b2.label == "⭕" && Args.c1.label == "⭕") won["⭕"] = true
        if (Args.a1.label == "⭕" && Args.a2.label == "⭕" && Args.a3.label == "⭕") won["⭕"] = true
        if (Args.b1.label == "⭕" && Args.b2.label == "⭕" && Args.b3.label == "⭕") won["⭕"] = true
        if (Args.c1.label == "⭕" && Args.c2.label == "⭕" && Args.c3.label == "⭕") won["⭕"] = true
        if (won["⭕"] != false) {
            Beklet.delete(message.author.id);
            Beklet.delete(opponent.id);
            m.edit(`${message.member} kazandın.\`+2.499\` ${message.guild.emojis.cache.get(emojiler.Görev.Para)}`)
            return message.member.coinAdd(3500);
        }
        if (Args.a1.label == "❌" && Args.b1.label == "❌" && Args.c1.label == "❌") won["❌"] = true
        if (Args.a2.label == "❌" && Args.b2.label == "❌" && Args.c2.label == "❌") won["❌"] = true
        if (Args.a3.label == "❌" && Args.b3.label == "❌" && Args.c3.label == "❌") won["❌"] = true
        if (Args.a1.label == "❌" && Args.b2.label == "❌" && Args.c3.label == "❌") won["❌"] = true
        if (Args.a3.label == "❌" && Args.b2.label == "❌" && Args.c1.label == "❌") won["❌"] = true
        if (Args.a1.label == "❌" && Args.a2.label == "❌" && Args.a3.label == "❌") won["❌"] = true
        if (Args.b1.label == "❌" && Args.b2.label == "❌" && Args.b3.label == "❌") won["❌"] = true
        if (Args.c1.label == "❌" && Args.c2.label == "❌" && Args.c3.label == "❌") won["❌"] = true
        if (won["❌"] != false) {
            Beklet.delete(message.author.id);
            Beklet.delete(opponent.id);
            m.edit(`${opponent} kazandın.\`+2.499\` ${message.guild.emojis.cache.get(emojiler.Görev.Para)}`)
            return opponent.coinAdd(3500);
        }
        let a1 = new MessageButton()
            .setStyle(Args.a1.style)
            .setLabel(Args.a1.label)
            .setID('a1')
            .setDisabled(Args.a1.disabled);
        let a2 = new MessageButton()
            .setStyle(Args.a2.style)
            .setLabel(Args.a2.label)
            .setID('a2')
            .setDisabled(Args.a2.disabled);
        let a3 = new MessageButton()
            .setStyle(Args.a3.style)
            .setLabel(Args.a3.label)
            .setID('a3')
            .setDisabled(Args.a3.disabled);
        let b1 = new MessageButton()
            .setStyle(Args.b1.style)
            .setLabel(Args.b1.label)
            .setID('b1')
            .setDisabled(Args.b1.disabled);
        let b2 = new MessageButton()
            .setStyle(Args.b2.style)
            .setLabel(Args.b2.label)
            .setID('b2')
            .setDisabled(Args.b2.disabled);
        let b3 = new MessageButton()
            .setStyle(Args.b3.style)
            .setLabel(Args.b3.label)
            .setID('b3')
            .setDisabled(Args.b3.disabled);
        let c1 = new MessageButton()
            .setStyle(Args.c1.style)
            .setLabel(Args.c1.label)
            .setID('c1')
            .setDisabled(Args.c1.disabled);
        let c2 = new MessageButton()
            .setStyle(Args.c2.style)
            .setLabel(Args.c2.label)
            .setID('c2')
            .setDisabled(Args.c2.disabled);
        let c3 = new MessageButton()
            .setStyle(Args.c3.style)
            .setLabel(Args.c3.label)
            .setID('c3')
            .setDisabled(Args.c3.disabled);
        let a = new MessageActionRow()
            .addComponents([a1, a2, a3])
        let b = new MessageActionRow()
            .addComponents([b1, b2, b3])
        let c = new MessageActionRow()
            .addComponents([c1, c2, c3])
        let buttons = { components: [a, b, c] }
        m.edit(`\`Tic-Tac-Toe\` <@!${Args.userid}> sıra sende (\`${Args.user == 0 ? "⭕" : "❌"}\`)`, buttons)
        const filter = (button) => button.clicker.user.id === Args.userid;
        const collector = m.createButtonCollector(filter, { max: 1, time: 10000 });

        collector.on('collect', b => {
            if (Args.user == 0) {
                Args.user = 1
                Args[b.id] = {
                    style: "green",
                    label: `⭕`,
                    disabled: true
                }
            } else {
                Args.user = 0
                Args[b.id] = {
                    style: "red",
                    label: `❌`,
                    disabled: true
                }
            }
            b.reply.defer()
            const map = (obj, fun) =>
                Object.entries(obj).reduce(
                    (prev, [key, value]) => ({
                        ...prev,
                        [key]: fun(key, value)
                    }),
                    {}
                );
            const objectFilter = (obj, predicate) =>
                Object.keys(obj)
                    .filter(key => predicate(obj[key]))
                    .reduce((res, key) => (res[key] = obj[key], res), {});
            let Brgs = objectFilter(map(Args, (_, fruit) => fruit.label == "➖"), num => num == true);
            if(Object.keys(Brgs).length == 0) m.edit('Oyun bitti...')
            if (Object.keys(Brgs).length <= -1) {
                opponent.coinAdd(1000);
                message.member.coinAdd(1000);
                Beklet.delete(message.author.id);
                Beklet.delete(opponent.id);
                return m.edit('Oyun bitti...')
            }
            tictactoe(m)
            
        });
        collector.on('end', collected => {
            if (collected.size == 0) {
                opponent.coinAdd(1000);
                message.member.coinAdd(1000);
                Beklet.delete(message.author.id);
                Beklet.delete(opponent.id);
                m.edit(`<@!${Args.userid}> Oyun bitti...`)
            }
        });
        }   
        }
        if(button.id === "iptal") {
            await button.reply.think(true)
            await button.reply.edit(`${message.member} ile karşılaşma iptal edildi.`)
            message.channel.send(embed.setDescription(`${message.guild.emojis.cache.get(emojiler.Iptal)} ${message.member}, ${opponent} karşılaşmayı red etti.`))
            msg1.delete()
        }
      });

      collector.on("end", async () => {
          
        msg1.delete({timeout: 7500}).catch(x => {})
      });
    }
};
