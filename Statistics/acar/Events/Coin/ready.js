const {} = require("discord.js");



 /**
 * @param {Client} client
 */


module.exports = () => {
    let guild = client.guilds.cache.get(ayarlar.sunucuID);

    setInterval(() => {
        let channel = client.channels.cache.get(kanallar.chatKanalı);
        if(!channel) return;

        channel.send(`${channel.guild.emojis.cache.get(emojiler.Görev.Sandık)}`).then(async msg => {
            await msg.react(emojiler.Görev.Altın);

            let reaction = await msg.awaitReactions((react, user) => react.emoji.id == emojiler.Görev.Altın && react.message.id == msg.id, {
                max: 1,
                time: 5000
            });
            
            let react = reaction.first();
            if(react){
                let user = react.users.cache.filter(e => !e.bot).first();
                if(!user) return;
                let uyecik = msg.guild.members.cache.get(user.id)
                let miktar = Math.floor(Math.random() * 2000)
                uyecik.coinAdd(Number(miktar))
                msg.delete()
                msg.channel.send(`${uyecik} tebrik ederim, kasadan sana ufak ödüller verildi. \`+${miktar}\` ${uyecik.guild.emojis.cache.get(emojiler.Görev.Para)}`).then(x => x.delete({timeout: 8500}))
            }
            else msg.delete();
            return;
        });
      }, 610000);


    setInterval( async () => {
        let channels = guild.channels.cache.filter(channel => channel.type == "voice" && channel.members.size > 0 && channel.parent);
        channels.forEach(channel => {
            let members = channel.members.filter(member => !member.user.bot && !member.voice.selfDeaf);
            members.forEach(async (member) => {
                if(member.bot) return;
                if(member.roles.cache.has(roller.jailRolü) || member.roles.cache.has(roller.şüpheliRolü) || member.roles.cache.has(roller.yasaklıTagRolü) || (roller.kayıtsızRolleri && roller.kayıtsızRolleri.some(rol => member.roles.cache.has(rol)))) return;
                if(coinConf.sistem) await member.coinAdd(coinConf.Ödül.Ses) 
            });
        });
    }, coinConf.kacmilisaniyesonra);
}

module.exports.config = {
    Event: "ready"
}