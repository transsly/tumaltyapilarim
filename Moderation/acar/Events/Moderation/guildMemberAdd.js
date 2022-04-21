const { MessageEmbed, Collection } = require('discord.js');

const Users = require('../../../Database/Schema/Users');
const Jails = require('../../../Database/Schema/Jails');
const VMutes = require('../../../Database/Schema/Voicemutes');
const Mutes = require('../../../Database/Schema/Mutes');



 /**
 * @param {Client} client 
 */

module.exports = async (member) => {
    if(member.guild.id !== ayarlar.sunucuID) return;
    let embed = new MessageEmbed().setAuthor(ayarlar.embed.başlık, member.guild.iconURL({dynamic: true})).setColor(ayarlar.embed.renk).setFooter(ayarlar.embed.altbaşlık)
    let User = await Users.findOne({ id: member.id }) 
    let Jail = await Jails.findOne({ _id: member.id });
    let OneWeak = Date.now()-member.user.createdTimestamp < 1000*60*60*24*7;
    let cezaPuan = await client.cezaPuan(member.id)
    if(member.user.bot) return member.guild.channels.cache.get(kanallar.hoşgeldinKanalı).send(`${member} isimli bot aramıza katılı.`);
    await member.setNickname(`${member.user.username.includes(ayarlar.tag) ? ayarlar.tag : (ayarlar.tagsiz ? ayarlar.tagsiz : (ayarlar.tag || ""))} İsim | Yaş`);
    if(User) { 
        if(User.Isim && User.Yas) {
        if(User.Cinsiyet !== "kayıtsız") await member.setNickname(`${member.user.username.includes(ayarlar.tag) ? ayarlar.tag : (ayarlar.tagsiz ? ayarlar.tagsiz : (ayarlar.tag || ""))} ${User.Isim} | ${User.Yas}`); 
        }
    }
    if(OneWeak) {
        await member.rolTanımla(roller.şüpheliRolü)
        await member.guild.channels.cache.get(kanallar.hoşgeldinKanalı).send(`${member} isimli kişi sunucuya katıldı fakat hesabı ${global.tarihHesapla(member.user.createdAt)} açıldığı için şüpheli olarak işaretlendi.`);
        return member.guild.kanalBul("şüpheli-log").send(embed.setDescription(`${member} isimli kişi sunucuya katıldı fakat hesabı ${global.tarihHesapla(member.user.createdAt)} açıldığı için şüpheli olarak işaretlendi.`));
    };
    if(ayarlar.yasakTaglar.some(tag => member.user.username.includes(tag))) {
        await member.rolTanımla(roller.yasaklıTagRolü).catch(err => {  client.logger.log(`${member.user.tag} (${member.user.id}) kişisi sunucuya katıldı fakat Yasaklı Tag rolü verilemedi.`, "caution") })
        return member.guild.channels.cache.get(kanallar.hoşgeldinKanalı).send(`${member} isimli kişi sunucumuza katıldı, ismininde \`Yasaklı Tag\` bulundurduğu için cezalı olarak belirlendi.`);
    };
    if(Jail) {
        await member.rolTanımla(roller.jailRolü).catch(err => { client.logger.log(`${member.user.tag} (${member.user.id}) kişisi sunucuya katıldı fakat Jail rolü verilemedi.`, "caution") })
        return member.guild.channels.cache.get(kanallar.hoşgeldinKanalı).send(`${member} isimli kişi sunucumuza katıldı, fakat aktif bir cezalandırılması bulunduğu için tekrardan cezalandırıldı. Adalet Mülkün Temelidir!`);
    };
    if(cezaPuan >= 50) {
    	await member.rolTanımla(roller.şüpheliRolü)
	member.send(embed.setDescription(`${member.guild.emojiGöster(emojiler.Cezalandırıldı)} ${member} ceza puanın \`${cezaPuan}\` olduğu için otomatik olarak şüpheli hesap olarak belirlendin. Adelet Mülkün Temelidir!`)).catch(x => {});
        return member.guild.channels.cache.get(kanallar.hoşgeldinKanalı).send(`${member} isimli kişi sunucumuza katıldı, Ceza puanı \`50\` üzeri olduğu için şüpheli olarak belirlendi. Adalet Mülkün Temelidir!`);
    
    }

      await rolTanımlama(member, roller.kayıtsızRolleri);
      hoşgeldinMesajı(member);
};

module.exports.config = {
    Event: "guildMemberAdd"
};

async function hoşgeldinMesajı(member) {
    const gi = (client.Invites.get(member.guild.id) || new Collection()).clone();
    let davettaslak;
    await member.guild.fetchInvites().then(async invites => { 
      let invite = invites.find(_i => gi.has(_i.code) && gi.get(_i.code).uses < _i.uses) || gi.find(_i => !invites.has(_i.code)) || member.guild.vanityURLCode;
      client.Invites.set(member.guild.id, invites);
      if(invite) {
        if(invite == member.guild.vanityURLCode) davettaslak = `özel url kullanarak katıldın ve`
        if(invite.inviter) davettaslak = `${invite.inviter ? invite.inviter : ayarlar.sunucuIsmi} üyesi tarafından davet edildin ve`
      } else { davettaslak = `özel url kullanarak katıldın ve` }

      member.guild.channels.cache.get(kanallar.hoşgeldinKanalı).send(`${ayarlar.tag} ${ayarlar.sunucuIsmi}'e Hoş geldin ${member} biz de seni bekliyorduk, hesabın __${global.tarihsel(member.user.createdAt)}__ tarihinde ${global.tarihHesapla(member.user.createdAt)} oluşturulmuş!

    Sunucumuza ${davettaslak} seninle birlikte ailemiz **${global.sayılıEmoji(member.guild.memberCount)}** kişi oldu!

    Sunucu kurallarımız <#${kanallar.kurallarKanalı}> kanalında belirtilmiştir. Unutma sunucu içerisinde ki \`ceza-i işlemler\` kuralları okuduğunu varsayarak gerçekleştirilecek.
${ayarlar.taglıalım ? `
Sunucumuz şu anlık yalnızca taglı(${ayarlar.tag}) üyelerimize açıktır. Tagımıza ulaşmak için herhangi bir kanala \`${global.sistem.prefix}tag\` yazabilirsiniz. :tada: :tada: :tada:
` : `
Tagımıza ulaşmak için herhangi bir kanala \`${global.sistem.prefix}tag\` yazman yeterlidir. Şimdiden iyi eğlenceler! :tada: :tada: :tada:`}`);

    })
}

async function rolTanımlama(üye, rol) {
    let VMute = await VMutes.findOne({ _id: üye.id });
    let Mute = await Mutes.findOne({ _id: üye.id });
    üye.rolTanımla(rol).then(async (acar) => {
      if(üye.user.username.includes(ayarlar.tag)) await üye.roles.add(roller.tagRolü)
      if(VMute) await üye.roles.add(roller.voicemuteRolü)
      if(Mute) await üye.roles.add(roller.muteRolü)
    })
}