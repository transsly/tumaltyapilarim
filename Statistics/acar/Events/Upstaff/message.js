const { Message } = require("discord.js");
const { Upstaff } = require("../../../../Moderation/Database/acarDatabase");
const veriler = new Map();
const verileriki = new Map();

 /**
 * @param {Message} message 
 */

module.exports = async (message) => {
    if(message.webhookID || message.author.bot || message.channel.type === "dm" || !message.guild || message.content.startsWith(sistem.prefix)) return;
    if(message.member.roles.cache.has(roller.jailRolü) || message.member.roles.cache.has(roller.şüpheliRolü) || message.member.roles.cache.has(roller.yasaklıTagRolü) || (roller.kayıtsızRolleri && roller.kayıtsızRolleri.some(rol => message.member.roles.cache.has(rol)))) return;
    if(!message.member.user.username.includes(ayarlar.tag) && !message.member.roles.cache.has(roller.tagRolü)) return;
    if(message.channel.id !== kanallar.chatKanalı) return;
    if (uPConf.yetkiler.some(x => message.member.roles.cache.has(x))) {
        const veri = veriler.get(message.author.id);
        if (veri && (veri % uPConf.kacmesajdabir) === 0) { 
          veriler.set(message.author.id, veri + 1);
          await Upstaff.addPoint(message.author.id, uPConf.odül.mesaj, "Mesaj")
        } else veriler.set(message.author.id, veri ? veri + 1 : 1);  
      }
}

module.exports.config = {
    Event: "message"
}


client.on("message", async (message) => {
  if(message.webhookID || message.author.bot || message.channel.type === "dm" || !message.guild || message.content.startsWith(sistem.prefix)) return;
  if(message.member.roles.cache.has(roller.jailRolü) || message.member.roles.cache.has(roller.şüpheliRolü) || message.member.roles.cache.has(roller.yasaklıTagRolü) || (roller.kayıtsızRolleri && roller.kayıtsızRolleri.some(rol => message.member.roles.cache.has(rol)))) return;
  if(message.channel.id !== kanallar.chatKanalı) return;
  const veri = verileriki.get(message.author.id);
  if (veri && (veri % coinConf.kacmesajdabir) === 0) { 
    verileriki.set(message.author.id, veri + 1);
    if(coinConf.sistem) await message.member.coinAdd(coinConf.Ödül.Mesaj)
  } else verileriki.set(message.author.id, veri ? veri + 1 : 1);  
});