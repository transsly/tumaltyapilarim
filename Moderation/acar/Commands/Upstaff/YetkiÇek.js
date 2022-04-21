const { Client, Message, MessageEmbed } = require("discord.js");
const Users = require('../../../Database/Schema/Users');
const Upstaffs = require('../../../Database/Schema/Upstaffs');
const Stats = require('../../../Database/Schema/Stats');
const Taskdata = require('../../../Database/Schema/Managements');

module.exports = {
    Isim: "yetkiçek",
    Komut: ["yçek","ytçek","yetkicek","ycek"],
    Kullanim: "taglı <@sehira/ID>",
    Aciklama: "Belirlenen üyeyi komutu kullanan üyenin taglısı olarak belirler.",
    Kategori: "Stat",
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
    let embed = new MessageEmbed().setAuthor(ayarlar.embed.başlık, message.guild.iconURL({dynamic: true})).setColor(ayarlar.embed.renk).setFooter(ayarlar.embed.altbaşlık)
    if(!roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(cevaplar.noyt);
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if(!uye) return message.channel.send(cevaplar.üye + ` \`${sistem.prefix}${module.exports.Isim} <@sehira/ID>\``);
    if(message.author.id === uye.id) return message.channel.send(cevaplar.kendi).then(x => x.delete({timeout: 5000}));
    let kontrol = await Users.findOne({id: uye.id})
    if(kontrol && !kontrol.Yetkilimi && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(`${cevaplar.prefix} ${uye} isimli üye veritabanında yetkili olarak belirlenmemiş.`);
    if(kontrol && kontrol.Yetkiekleyen) {
        let Yetkili = await Users.findOne({id: kontrol.Yetkiekleyen }) || {}
    	if(Yetkili && Yetkili.Yetkililer) {
            const BabanıSikeyim = message.guild.members.cache.get(kontrol.Yetkiekleyen)
    		const findUser = Yetkili.Yetkililer.find(acar => acar.id == uye.id);
    		await Users.updateOne({ id: kontrol.Yetkiekleyen }, { $pull: { "Yetkililer": findUser } }, { upsert: true }).exec();
    		if(taskConf.sistem && BabanıSikeyim && taskConf.yetkiler.some(x => BabanıSikeyim.roles.cache.has(x)) && !BabanıSikeyim.roles.cache.has(taskConf.görevsonyetki)) await BabanıSikeyim.taskAdd("Yetkili", -1).catch(x => {})
            if(coinConf.sistem && BabanıSikeyim) await BabanıSikeyim.coinAdd(-coinConf.Ödül.Yetkili)
        } 
    }
    await Users.updateOne({ id: uye.id }, { $set: { "Yetkilimi": false, "Yetkiekleyen": new String() } }, { upsert: true }).exec();
    if(uPConf.sistem) await Upstaffs.findByIdAndDelete(uye.id)
    if(taskConf.yetkiler.some(x => uye.roles.cache.has(x)) && !uye.roles.cache.has(taskConf.görevsonyetki)) await Taskdata.findByIdAndDelete(uye.id)
    let altYetki = message.guild.roles.cache.get(uPConf.altilkyetki)
    await uye.roles.remove(uye.roles.cache.filter(rol => altYetki.position <= rol.position));
    await Stats.updateOne({ userID: uye.id }, { upstaffVoiceStats: new Map(), upstaffChatStats: new Map() });
    message.guild.kanalBul("yetki-log").send(embed.setDescription(`${message.author} isimli yetkili ${uye.toString()} isimli üyenin \`${tarihsel(Date.now())}\` tarihinde yetkini çekti!`))
    message.channel.send(`${message.guild.emojiGöster(emojiler.Onay)} ${uye.toString()} isimli üyeyi başarıyla yetkisi çekildi!`).then(x => x.delete({timeout: 5000}));
    }
};