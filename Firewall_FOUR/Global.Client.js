const { Client, Collection, GuildMember, Guild, MessageEmbed, Message } = require('discord.js');
const fs = require('fs')
const moment = require('moment');
require("moment-duration-format");
require("moment-timezone");
const ms = require('ms');
const dataLimit = new Map()
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
                this.guardConf = global.guardConf = require('../Moderation/acar/Settings/_guard.json');
            // Sistem Gereksinimi

            // em
                this.setMaxListeners(10000)
            // em

            

            // Logger
                this.logger = require("../Moderation/acar/Functions/Global.logger");
                this.on("guildUnavailable", async (guild) => { console.log(`[UNAVAIBLE]: ${guild.name}`) })
                .on("disconnect", () => this.logger.log("Bot is disconnecting...", "disconnecting"))
                .on("reconnecting", () => this.logger.log("Bot reconnecting...", "reconnecting"))
                .on("error", (e) => this.logger.log(e, "error"))
                .on("warn", (info) => this.logger.log(info, "warn"));

                process.on("unhandledRejection", (err) => {this.logger.log(err, "caution")});
                process.on("warning", (warn) => { this.logger.log(warn, "varn") });
                process.on("beforeExit", () => { console.log('Sistem kapatılıyor...'); });
                process.on("uncaughtException", err => {
                    const hata = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
                        console.error("Beklenmedik Hata: ", hata);
                       // process.exit(1);
                });
            // Logger
    }

    safe(id, process = "İşlem Bulunamadı.", processnumber) {
        let uye = this.guilds.cache.get(ayarlar.sunucuID).members.cache.get(id);
        let senkron = fs.readFileSync('../Moderation/acar/Settings/_guard.json', 'utf8')
        let safelist = JSON.parse(senkron).guardIzinliler || []
        let everHere = JSON.parse(fs.readFileSync('../Moderation/acar/Settings/_guard.json', 'utf8')).everyoneIzinliler.includes(id)
        let emoji = JSON.parse(fs.readFileSync('../Moderation/acar/Settings/_guard.json', 'utf8')).emojiIzinliler.includes(id)
        let sagtikUyeBanKick = JSON.parse(fs.readFileSync('../Moderation/acar/Settings/_guard.json', 'utf8')).banKickIzinliler.includes(id)
        let sagtikRolVer = JSON.parse(fs.readFileSync('../Moderation/acar/Settings/_guard.json', 'utf8')).rolYönetIzinliler.includes(id)
        if(this.sistem.staff.some(x => x.id == id)) return true;

        if(processnumber == 1) if(emoji) return this.limitChecker(uye, process)
        if(processnumber == 2) if(sagtikUyeBanKick) return this.limitChecker(uye, process)
        if(processnumber == 3) if(sagtikRolVer) return this.limitChecker(uye, process)
        if(processnumber == 4) if(everHere) return this.limitChecker(uye, process)

        if(!uye || uye.id === client.user.id || uye.id === uye.guild.owner.id || safelist.some(g => uye.id === g || uye.roles.cache.has(g))) {
            return this.limitChecker(uye, process)
        };
        return false;
    }
    limitChecker(uye, process = "İşlem Bulunamadı.") {
	if(uye.user.bot) return true
        let id = uye.id
        let limitController = dataLimit.get(id) || []
        let type = { _id: id, proc: process, date: Date.now() }
        limitController.push(type)
        dataLimit.set(id, limitController)
        setTimeout(() => { if (dataLimit.has(id)) { dataLimit.delete(id) } }, ms("10m"))
           
            if (limitController.length >= 12) {
                let loged = uye.guild.kanalBul("guard-log");
                let taslak = `${uye} (\`${uye.id}\`) isimli güvenli listesinde ki yönetici anlık işlem uygulama nedeni ile "__${process}__" zoruyla cezalandırıldı.
\`\`\`fix
Son Anlık işlemler;
${limitController.map((x, index) => `${index+1}. | ${x.proc} | ${tarihsel(x.date)}`).join("\n")}
                \`\`\``
                if(loged) loged.send(taslak);
                this.sistem.staff.forEach(x => {
                    let botOwner = uye.guild.members.cache.get(x)
                    if(botOwner) botOwner.send(taslak).catch(err => {})
                })
                uye.guild.owner.send(taslak).catch(err => {})
                return false 
            } else {
                return true
            }
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

const puniUser = global.puniUser = async function(id, type) {
    let uye = client.guilds.cache.get(ayarlar.sunucuID).members.cache.get(id);
    if (!uye) return;

    if (type == "jail") { 
    if(uye.voice.channel) await uye.voice.kick().catch(err => {})
    return await uye.roles.cache.has(roller.boosterRolü) ? uye.roles.set([roller.boosterRolü, roller.jailRolü]) : uye.roles.set([roller.jailRolü]); 
    }

    if (type == "ban") return await uye.ban({ reason: "Guard Tarafından Siki Tuttu." }).catch(err => {}) 
};

const ytKapat = global.ytKapat = async function (){
    let sunucu = client.guilds.cache.get(ayarlar.sunucuID);
    if(!sunucu) return;
    sunucu.roles.cache.filter(r => r.editable && (r.permissions.has("ADMINISTRATOR") || r.permissions.has("MANAGE_NICKNAMES") || r.permissions.has("MANAGE_WEBHOOKS") || r.permissions.has("MANAGE_ROLES") || r.permissions.has("MANAGE_CHANNELS") || r.permissions.has("MANAGE_EMOJIS") || r.permissions.has("MANAGE_GUILD") || r.permissions.has("BAN_MEMBERS") || r.permissions.has("KICK_MEMBERS"))).forEach(async r => await r.setPermissions(0));     
}


let aylartoplam = { "01": "Ocak", "02": "Şubat", "03": "Mart", "04": "Nisan", "05": "Mayıs", "06": "Haziran", "07": "Temmuz", "08": "Ağustos", "09": "Eylül", "10": "Ekim", "11": "Kasım", "12": "Aralık" };
global.aylar = aylartoplam;

const tarihsel = global.tarihsel = function(tarih) {
    let tarihci = moment(tarih).tz("Europe/Istanbul").format("DD") + " " + global.aylar[moment(tarih).tz("Europe/Istanbul").format("MM")] + " " + moment(tarih).tz("Europe/Istanbul").format("YYYY HH:mm")   
    return tarihci;
};

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