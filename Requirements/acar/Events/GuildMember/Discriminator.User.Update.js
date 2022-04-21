const { MessageEmbed, Collection } = require('discord.js');

 /**
 * @param {User} oldUser 
 * @param {User} newUser 
 */

module.exports = async (oldUser, newUser) => {
    if(!ayarlar.etiket) return; 
    if(oldUser.discriminator == newUser.discriminator || oldUser.bot || newUser.bot) return;
    let client = oldUser.client;
    let guild = client.guilds.cache.get(ayarlar.sunucuID);
    if(!guild) return;
    let user = guild.members.cache.get(oldUser.id);
    if(!user) return;

    /**
     * @type {GuildMember}
     */

    let embed = new MessageEmbed().setAuthor(ayarlar.embed.başlık, guild.iconURL({dynamic: true})).setFooter(ayarlar.embed.altbaşlık)
    if ((ayarlar.yasakEtiketler.some(tag => newUser.discriminator.includes(tag))) && (roller.yasaklıTagRolü && !user.roles.cache.has(roller.yasaklıTagRolü))) {
        user.rolTanımla(roller.yasaklıTagRolü)
        user.send(`**${user.guild.name}** sunucumuzun yasaklı etiket taglarından birini aldığın için jaile atıldın! Tagı geri bıraktığında jailden çıkacaksın.`)
        guild.kanalBul("yasaklı-tag-log").send(embed.setColor("RANDOM").setDescription(`${user} adlı kişi ismine **${tarihsel(Date.now())}** tarihinde yasaklı etiket tagı aldığı için jaile atıldı.`))
        return;
    };

    if ((!ayarlar.yasakEtiketler.some(tag => newUser.discriminator.includes(tag))) && (roller.yasaklıTagRolü && user.roles.cache.has(roller.yasaklıTagRolü))) {
        user.send(`**${user.guild.name}** sunucumuzun yasaklı etiket taglarından birine sahip olduğun için cezalıdaydın ve şimdi bu yasaklı tagı çıkardığın için cezalıdan çıkarıldın!`).catch();
        guild.kanalBul("yasaklı-tag-log").send(embed.setColor("RANDOM").setDescription(`${user} adlı kişi ismine **${tarihsel(Date.now())}** tarihinde yasaklı etiket tagı çıkarttığı için cezalıdan çıkartıldı!`).setColor("GREEN"))
        await user.rolTanımla(roller.kayıtsızRolleri);
    };
    
    if (newUser.discriminator !== oldUser.discriminator) {
        if (oldUser.discriminator == ayarlar.etiketTag && newUser.discriminator !== ayarlar.etiketTag) {
            user.roles.remove(ayarlar.etiketRol).catch(err => {})
            guild.kanalBul("ekip-tag-log").send(embed.setColor("RED").setDescription(`${user} üyesi üzerindeki \`#${ayarlar.etiketTag}\` ekip tagını çıkartarak ${user.guild.roles.cache.get(ayarlar.etiketRol)} rolü üzerinden alındı.`))
         } else if (oldUser.discriminator !== ayarlar.etiketTag && newUser.discriminator == ayarlar.etiketTag) {
            user.roles.add(ayarlar.etiketRol).catch(err => {})
            guild.kanalBul("ekip-tag-log").send(embed.setColor("GREEN").setDescription(`${user} üyesi üzerine \`#${ayarlar.etiketTag}\` ekip tagını alarak ${user.guild.roles.cache.get(ayarlar.etiketRol)} rolü üzerine rol verildi.`))
        }
    }

};

module.exports.config = {
    Event: "userUpdate"
};




