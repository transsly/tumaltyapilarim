const { Client, Collection, GuildMember, Guild, MessageEmbed } = require('discord.js');
const fs = require('fs')
const moment = require('moment');
require("moment-duration-format");
require("moment-timezone");

class acar extends Client {
    constructor(options) {
        super(options);

            // Sistem Gereksinimi
                this.ayarlar = global.ayarlar = require('../Moderation/acar/Settings/_extends');
                this.kanalar = global.kanallar = require('../Moderation/acar/Settings/_channels.json');
                this.emojiler = global.emojiler = require('../Moderation/acar/Settings/_emojis.json');
                this.roller = global.roller = require('../Moderation/acar/Settings/_roles.json');
                this.sistem = global.sistem = require('../Moderation/acar/Settings/system');
                this.cevaplar = global.cevaplar = require('../Moderation/acar/Settings/reply');
                this.uPConf = global.uPConf = this.StConf = global.StConf = require('../Moderation/acar/Settings/_stat');
                this.taskConf = global.taskConf = require('../Moderation/acar/Settings/_task');
                this.coinConf = global.coinConf = require('../Moderation/acar/Settings/_coin'); 
                require('../Moderation/acar/Functions/Global.Task')(this);
                this.setMaxListeners(10000)
            // Sistem Gereksinimi

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
                this.Invites = new Map();
            // İnvite

            // Logger
                this.logger = require("../Moderation/acar/Functions/Global.logger");
                this.on("guildUnavailable", async (guild) => { console.log(`[UNAVAIBLE]: ${guild.name}`) })
                .on("disconnect", () => this.logger.log("Bot is disconnecting...", "disconnecting"))
                .on("reconnecting", () => this.logger.log("Bot reconnecting...", "reconnecting"))
                .on("error", (e) => this.logger.log(e, "error"))
                .on("warn", (info) => this.logger.log(info, "warn"));

                process.on("unhandledRejection", (err) => { this.logger.log(err, "caution") });
                process.on("warning", (warn) => { this.logger.log(warn, "varn") });
                process.on("beforeExit", () => { console.log('Sistem kapatılıyor...'); });
                process.on("uncaughtException", err => {
                    const hata = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
                        console.error("Beklenmedik Hata: ", hata);
                       // process.exit(1);
                });
            // Logger
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
    

}

class Mongo {
    static Connect() {
        require('mongoose').connect(require('../Moderation/acar/Settings/system').MongoURL, {
            useCreateIndex: true,
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

Guild.prototype.emojiGöster = function(emojiid) {
    let emoji = this.emojis.cache.get(emojiid)
    return emoji;
}



module.exports = { acar, Mongo };