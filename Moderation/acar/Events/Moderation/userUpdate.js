const { MessageEmbed, Collection } = require('discord.js');
const Users = require('../../../Database/Schema/Users');
const Upstaffs = require('../../../Database/Schema/Upstaffs');
const { Upstaff } = require('../../../Database/acarDatabase');
const Stats = require('../../../Database/Schema/Stats');
const Taskdata = require('../../../Database/Schema/Managements');

 /**
 * @param {User} oldUser 
 * @param {User} newUser 
 */

module.exports = async (oldUser, newUser) => {
    if(oldUser.username == newUser.username || oldUser.bot || newUser.bot) return;
    let client = oldUser.client;
    let guild = client.guilds.cache.get(ayarlar.sunucuID);
    if(!guild) return;
    let user = guild.members.cache.get(oldUser.id);
    if(!user) return;
    let UserData = await Users.findOne({ id: user.id });

    /**
     * @type {GuildMember}
     */

    let embed = new MessageEmbed().setAuthor(ayarlar.embed.başlık, guild.iconURL({dynamic: true})).setFooter(ayarlar.embed.altbaşlık).setColor(ayarlar.embed.renk)
    if ((ayarlar.yasakTaglar.some(tag => newUser.username.includes(tag))) && (roller.yasaklıTagRolü && !user.roles.cache.has(roller.yasaklıTagRolü))) {
        user.rolTanımla(roller.yasaklıTagRolü)
        user.send(`**${user.guild.name}** sunucumuzun yasaklı taglarından birini kullanıcı adına aldığın için jaile atıldın! Tagı geri bıraktığında jailden çıkacaksın.`)
        guild.kanalBul("yasaklı-tag-log").send(embed.setDescription(`${user} adlı kişi ismine **${tarihsel(Date.now())}** tarihinde yasaklı tag aldığı için jaile atıldı.`))
        return;
    };

    if ((!ayarlar.yasakTaglar.some(tag => newUser.username.includes(tag))) && (roller.yasaklıTagRolü && user.roles.cache.has(roller.yasaklıTagRolü))) {
        user.send(`**${user.guild.name}** sunucumuzun yasaklı taglarından birine sahip olduğun için cezalıdaydın ve şimdi bu yasaklı tagı çıkardığın için cezalıdan çıkarıldın!`).catch();
        guild.kanalBul("yasaklı-tag-log").send(embed.setDescription(`${user} adlı kişi ismine **${tarihsel(Date.now())}** tarihinde yasaklı tagı çıkarttığı için cezalıdan çıkartıldı!`).setColor("GREEN"))
        if(UserData) {
            if(ayarlar.taglıalım && !newUser.username.includes(ayarlar.tag)) {
                await user.rolTanımla(roller.kayıtsızRolleri);
                return;
            }
            if(UserData.Cinsiyet == "erkek") await user.rolTanımla(roller.erkekRolleri);
            if(UserData.Cinsiyet == "kadın") await user.rolTanımla(roller.kadınRolleri);
            if(UserData.Cinsiyet == "kayıtsız") await user.rolTanımla(roller.kayıtsızRolleri);
            if(newUser.username.includes(ayarlar.tag)) await user.roles.add(roller.tagRolü)
            return;
        }
        await user.rolTanımla(roller.kayıtsızRolleri);
    };
    
    if(newUser.username.includes(ayarlar.tag) && !user.roles.cache.has(roller.tagRolü)){
        guild.kanalBul("tag-log").send(embed.setDescription(`Heyy! ${user} kişisi ismine \`${ayarlar.tag}\` tagı alarak ailemize katıldı!`).setColor("GREEN"));
        if (roller.jailRolü && user.roles.cache.has(roller.jailRolü)) return;
        if (roller.yasaklıTagRolü && user.roles.cache.has(roller.yasaklıTagRolü)) return;
        user.roles.add(roller.tagRolü).catch();
        if(user.manageable) user.setNickname(user.displayName.replace(ayarlar.tagsiz, ayarlar.tag))

     } else if(!newUser.username.includes(ayarlar.tag) && user.roles.cache.has(roller.tagRolü)){
       guild.kanalBul("tag-log").send(embed.setDescription(`${user} kişisi isminden \`${ayarlar.tag}\` tagı çıkararak <@&${roller.tagRolü}> ailemizden ayrıldı!`).setColor("RED"));
       if(uPConf.sistem) await Upstaffs.findByIdAndDelete(user.id)
       if(taskConf.yetkiler.some(x => user.roles.cache.has(x)) && !user.roles.cache.has(taskConf.görevsonyetki)) await Taskdata.findByIdAndDelete(user.id)
       await Stats.updateOne({ userID: user.id }, { upstaffVoiceStats: new Map(), upstaffChatStats: new Map() });
       if(ayarlar.taglıalım) {
            if(user.voice.channel) await user.voice.kick()
            await user.setNickname(`${user.user.username.includes(ayarlar.tag) ? ayarlar.tag : (ayarlar.tagsiz ? ayarlar.tagsiz : (ayarlar.tag || ""))} İsim | Yaş`)
            await user.rolTanımla(roller.kayıtsızRolleri)   
        } else {
            await user.setNickname(user.displayName.replace(ayarlar.tag, ayarlar.tagsiz))
            let tagRol = guild.roles.cache.get(roller.tagRolü);
            await user.roles.remove(user.roles.cache.filter(rol => tagRol.position <= rol.position));
        }
        if(UserData) {
            if(UserData.Yetkilimi) {
                let Yetkili = await Users.findOne({id: UserData.Yetkiekleyen}) || {}
                if(Yetkili) {
                    let babanıSikim = user.guild.members.cache.get(UserData.Taglayan)
                    let findUser = await Yetkili.Yetkililer.find(acar => acar.id == user.id);
                    if(findUser) await Users.updateOne({ id: UserData.Yetkiekleyen }, { $pull: { "Yetkililer": findUser } }, { upsert: true })
                    if(taskConf.sistem && babanıSikim && taskConf.yetkiler.some(x => babanıSikim.roles.cache.has(x)) && !babanıSikim.roles.cache.has(taskConf.görevsonyetki)) await babanıSikim.taskAdd("Yetkili", -1).catch(x => {})
                    if(coinConf.sistem && babanıSikim) await babanıSikim.coinAdd(-coinConf.Ödül.Yetkili)
                }
            }
            if(UserData.Taglandı)  {
                let SikimAnani = await Users.findOne({id: UserData.Taglayan}) || {}
                if(SikimAnani) {
                    let yetkili = user.guild.members.cache.get(UserData.Taglayan)
                    let findUser = await SikimAnani.Taglılar.find(acar => acar.id == user.id);
                    if(findUser) await Users.updateOne({ id: UserData.Taglayan }, { $pull: { "Taglılar": findUser } }, { upsert: true })
                    if(uPConf.sistem) await Upstaff.addPoint(UserData.Taglayan, -uPConf.odül.taglı)
                    if(taskConf.sistem && yetkili && taskConf.yetkiler.some(x => yetkili.roles.cache.has(x)) && !yetkili.roles.cache.has(taskConf.görevsonyetki)) await yetkili.taskAdd("Taglı", -1).catch(x => {})
                    if(coinConf.sistem && yetkili) await yetkili.coinAdd(-coinConf.Ödül.Taglı)
                }
            }
        }
    }

};

module.exports.config = {
    Event: "userUpdate"
};
