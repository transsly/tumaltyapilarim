const { Client, Collection, GuildMember, Guild, MessageEmbed } = require('discord.js');
const fs = require('fs')
const moment = require('moment');
require("moment-duration-format");
require("moment-timezone");
const Punitives = require('./Database/Schema/Punitives');

class acar extends Client {
    constructor(options) {
        super(options);

            // Sistem Gereksinimi
                this.kanalar = global.kanallar = require('./acar/Settings/_channels.json')
                this.emojiler = global.emojiler = require('./acar/Settings/_emojis.json')
                this.roller = global.roller = require('./acar/Settings/_roles.json')
                this.ayarlar = global.ayarlar = require('./acar/Settings/_extends');
                this.sistem = global.sistem = require('./acar/Settings/system');
                this.cevaplar = global.cevaplar = require('./acar/Settings/reply');
                this.uPConf = global.uPConf = this.StConf = global.StConf = require('./acar/Settings/_stat');
                this.taskConf = global.taskConf = require('./acar/Settings/_task');
                this.guardConf = global.guardConf = require('../Moderation/acar/Settings/_guard.json');
                this.coinConf = global.coinConf = require('./acar/Settings/_coin'); 
                require('./acar/Functions/Global.Task')(this);
                this.setMaxListeners(10000)
            // Sistem Gereksinimi

            // Handler
                this.komutlar = new Collection();
                this.komut = new Collection();
            // Handler

            // Check User
                this.users.getUser = GetUser;
                this.getUser = GetUser;

                async function GetUser(id) {
                    try {
                        return await this.users.fetch(id);
                    } catch (error) {
                        return undefined;
                    }
                };
            // Check User
            
            // İnvite
                this.Invites = new Collection();
            // İnvite

            // Limit
                this.banLimit = new Map();
                this.banSure = new Map();

                this.jailLimit = new Map();
                this.jailSure = new Map();
            // Limit

            // Logger
                this.logger = require("./acar/Functions/Global.logger");
                this.on("guildUnavailable", async (guild) => { console.log(`[UNAVAIBLE]: ${guild.name}`) })
                .on("disconnect", () => this.logger.log("Bot is disconnecting...", "disconnecting"))
                .on("reconnecting", () => this.logger.log("Bot reconnecting...", "reconnecting"))
                .on("error", (e) => this.logger.log(e, "error"))
                .on("warn", (info) => this.logger.log(info, "warn"));
                //process.on("unhandledRejection", (err) => { this.logger.log(err, "caution") });
                process.on("warning", (warn) => { this.logger.log(warn, "varn") });
                process.on("beforeExit", () => { console.log('Sistem kapatılıyor...'); });
                process.on("uncaughtException", err => {
                    const hata = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
                        console.error("Beklenmedik Hata: ", hata);
                       // process.exit(1);
                });
            // Logger
    }

    async fetchCommands() {
        let dirs = fs.readdirSync("./acar/Commands", { encoding: "utf8" });
        this.logger.log(`${dirs.length} category in client loaded.`, "category");
        dirs.forEach(dir => {
            let files = fs.readdirSync(`./acar/Commands/${dir}`, { encoding: "utf8" }).filter(file => file.endsWith(".js"));
            this.logger.log(`${files.length} commands loaded in ${dir} category.`, "load");
            files.forEach(file => {
                let referans = require(`./acar/Commands/${dir}/${file}`);
                if(referans.onLoad != undefined && typeof referans.onLoad == "function") referans.onLoad(this);
                this.komutlar.set(referans.Isim, referans);
                if (referans.Komut) referans.Komut.forEach(alias => this.komut.set(alias, referans));
            });
        });
    }

    async fetchEvents() {
        let dirs = fs.readdirSync("./acar/Events", { encoding: "utf8" });
        dirs.forEach(dir => {
            let files = fs.readdirSync(`./acar/Events/${dir}`, { encoding: "utf8" }).filter(file => file.endsWith(".js"));
            files.forEach(file => {
                let referans = require(`./acar/Events/${dir}/${file}`);
                this.on(referans.config.Event, referans);
            });
        });
     }

    async cezaPuan(memberID) {
        let res = await Punitives.find({ Uye: memberID })
        if (!res) return 0
        let filArray = res.map(x => (x.Tip))
        let Mute = filArray.filter(x => x == "Susturulma").length || 0
        let VMute = filArray.filter(x => x == "Seste Susturulma").length || 0
        let Jail = filArray.filter(x => x == "Cezalandırılma").length || 0
        let Ban = filArray.filter(x => x == "Yasaklanma").length || 0
        // let Warn = filArray.filter(x => x == "Uyarılma").length || 0
        let cezaPuanı = (Mute * 5) + (VMute * 8) + (Jail * 15) + (Ban * 30)
        return cezaPuanı;
      }

}

class Mongo {
    static Connect() {
        require('mongoose').connect(require('./acar/Settings/system').MongoURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        }).then(() => {
            client.logger.log("Connected to the MongoDB.", "mongodb");
        }).catch((err) => {
            client.logger.log("Unable to connect to the MongoDB. Error: " + err, "error");
        });
    }

}

const tarihhesapla = global.tarihHesapla = (date) => {
    const startedAt = Date.parse(date);
    var msecs = Math.abs(new Date() - startedAt);
    const years = Math.floor(msecs / (1000 * 60 * 60 * 24 * 365));
    msecs -= years * 1000 * 60 * 60 * 24 * 365;
    const months = Math.floor(msecs / (1000 * 60 * 60 * 24 * 30));
    msecs -= months * 1000 * 60 * 60 * 24 * 30;
    const weeks = Math.floor(msecs / (1000 * 60 * 60 * 24 * 7));
    msecs -= weeks * 1000 * 60 * 60 * 24 * 7;
    const days = Math.floor(msecs / (1000 * 60 * 60 * 24));
    msecs -= days * 1000 * 60 * 60 * 24;
    const hours = Math.floor(msecs / (1000 * 60 * 60));
    msecs -= hours * 1000 * 60 * 60;
    const mins = Math.floor((msecs / (1000 * 60)));
    msecs -= mins * 1000 * 60;
    const secs = Math.floor(msecs / 1000);
    msecs -= secs * 1000;
    var string = "";
    if (years > 0) string += `${years} yıl`
    else if (months > 0) string += `${months} ay ${weeks > 0 ? weeks+" hafta" : ""}`
    else if (weeks > 0) string += `${weeks} hafta ${days > 0 ? days+" gün" : ""}`
    else if (days > 0) string += `${days} gün ${hours > 0 ? hours+" saat" : ""}`
    else if (hours > 0) string += `${hours} saat ${mins > 0 ? mins+" dakika" : ""}`
    else if (mins > 0) string += `${mins} dakika ${secs > 0 ? secs+" saniye" : ""}`
    else if (secs > 0) string += `${secs} saniye`
    else string += `saniyeler`;
    string = string.trim();
    return `\`${string} önce\``;
  };

const sayilariCevir = global.sayilariCevir = function(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

let aylartoplam = { "01": "Ocak", "02": "Şubat", "03": "Mart", "04": "Nisan", "05": "Mayıs", "06": "Haziran", "07": "Temmuz", "08": "Ağustos", "09": "Eylül", "10": "Ekim", "11": "Kasım", "12": "Aralık" };
global.aylar = aylartoplam;

const kalanzaman = global.kalanzaman = function(tarih) {
   return moment.duration((tarih - Date.now())).format('H [Saat,] m [Dakika,] s [Saniye]');
}


const tarihsel = global.tarihsel = function(tarih) {
    let tarihci = moment(tarih).tz("Europe/Istanbul").format("DD") + " " + global.aylar[moment(tarih).tz("Europe/Istanbul").format("MM")] + " " + moment(tarih).tz("Europe/Istanbul").format("YYYY HH:mm")   
    return tarihci;
};

const sayılıEmoji = global.sayılıEmoji = function(sayi) {
    var basamakbir = sayi.toString().replace(/ /g, "     ");
    var basamakiki = basamakbir.match(/([0-9])/g);
    basamakbir = basamakbir.replace(/([a-zA-Z])/g, "Belirlenemiyor").toLowerCase();
    if (basamakiki) {
        basamakbir = basamakbir.replace(/([0-9])/g, d => {
            return {
                "0": emojiler.Sayı.sıfır,
                "1": emojiler.Sayı.bir,
                "2": emojiler.Sayı.iki,
                "3": emojiler.Sayı.üç,
                "4": emojiler.Sayı.dört,
                "5": emojiler.Sayı.beş,
                "6": emojiler.Sayı.altı,
                "7": emojiler.Sayı.yedi,
                "8": emojiler.Sayı.sekiz,
                "9": emojiler.Sayı.dokuz
            }[d];
        });
    }
    return basamakbir;
}

Guild.prototype.kanalBul = function(kanalisim) {
    let kanal = this.channels.cache.find(k => k.name === kanalisim)
    return kanal;
}

GuildMember.prototype.rolTanımla = function (rolidler = []) {
    let rol = this.roles.cache.clone().filter(e => e.managed).map(e => e.id).concat(rolidler);
    return this.roles.set(rol);
}

GuildMember.prototype.kayıtRolVer = function (rolidler = []) {
    let rol;
    if(this.roles.cache.has(roller.vipRolü)) { 
    rol = this.roles.cache.clone().filter(e => e.managed).map(e => e.id).concat(rolidler).concat(roller.vipRolü) 
    } else {
    rol = this.roles.cache.clone().filter(e => e.managed).map(e => e.id).concat(rolidler)
    };
    return this.roles.set(rol);
}

Guild.prototype.emojiGöster = function(emojiid) {
    let emoji = this.emojis.cache.get(emojiid)
    return emoji;
}

Guild.prototype.kayıtLog = async function kayıtLog(yetkili, üye, cins, channelName) {
    let kanal = this.channels.cache.find(k => k.name === channelName);
    let cinsiyet;
    if(cins === "erkek") { cinsiyet = "Erkek" } else if(cins === "kadın") { cinsiyet = "Kadın" }
    if(kanal) {
        let embed = new MessageEmbed().setAuthor(ayarlar.embed.başlık, kanal.guild.iconURL({dynamic: true, size: 2048})).setColor(ayarlar.embed.renk).setDescription(`${üye} isimli üye **${tarihsel(Date.now())}** tarihinde ${yetkili} tarafından **${cinsiyet}** olarak kayıt edildi.`).setFooter(ayarlar.embed.altbaşlık)
        kanal.send(embed)
    };
}

Guild.prototype.log = async function log(cezano, user, admin, tip, channelName) {
    let channel = this.channels.cache.find(x => x.name === channelName);
    let tur;
    if(tip === "Susturulma") tur = "metin kanallarından susturuldu!"
    if(tip === "Seste Susturulma") tur = "ses kanallarından susturuldu!"
    if(tip === "Cezalandırılma") tur = "cezalandırıldı!"
    if(tip === "Uyarılma") tur = "uyarıldı!"
    if(tip === "Yasaklanma") tur = "yasaklandı!"
    if (channel) {
        let embed = new MessageEmbed()
          .setAuthor(ayarlar.embed.başlık, channel.guild.iconURL({dynamic: true, size: 2048})).setColor(ayarlar.embed.renk)
          .setDescription(`${user} (\`#${cezano.No}\`) üyesi, **${tarihsel(Date.now())}** tarihinde **${cezano.Sebep}** nedeniyle ${tur}`)
          .setFooter(ayarlar.embed.altbaşlık + ` • Ceza Numarası: #${cezano.No}`)

        channel.send(embed)
    }

}

Array.prototype.chunk = function(chunk_size) {
    let myArray = Array.from(this);
    let tempArray = [];
    for (let index = 0; index < myArray.length; index += chunk_size) {
      let chunk = myArray.slice(index, index + chunk_size);
      tempArray.push(chunk);
    }
    return tempArray;
  };
  

module.exports = { acar, Mongo };