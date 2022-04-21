const {} = require('discord.js');

const Punitives = require('../../../../Moderation/Database/Schema/Punitives');
const Mute = require('../../../../Moderation/Database/Schema/Mutes');
const ms = require('ms');

const usersMap = new Map();
const LIMIT = 4;
const TIME = 10000;
const DIFF = 2000;

 /**
 * @param {Client} client 
 */

client.on('messageUpdate', async (oldMessage, newMessage) => { 
    if(newMessage.webhookID || newMessage.author.bot || newMessage.channel.type === "dm") return;
    if(newMessage.member.hasPermission("ADMINISTRATOR")) return;
    if(roller.üstYönetimRolleri.some(oku => newMessage.member.roles.cache.has(oku))) return;
    if(roller.yönetimRolleri.some(oku => newMessage.member.roles.cache.has(oku))) return;
    if(newMessage.content.length > "150") newMessage.delete().catch(err => {});
});

module.exports = async (message) => {
    if(message.webhookID || message.author.bot || message.channel.type === "dm") return;
    if(message.member.hasPermission("ADMINISTRATOR")) return;
    if(roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku))) return;
    if(roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku))) return;
    if(roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku))) return;
    if(message.content.length > "150") message.delete().catch(err => {});
                if(usersMap.has(message.author.id)) {
                    const userData = usersMap.get(message.author.id);
                    const {lastMessage, timer} = userData;
                    const difference = message.createdTimestamp - lastMessage.createdTimestamp;
                    let msgCount = userData.msgCount;
                    
                        if(difference > DIFF) {
                            clearTimeout(timer);
                            userData.msgCount = 1;
                            userData.lastMessage = message;
                                userData.timer = setTimeout(() => {
                                    usersMap.delete(message.author.id);
                                }, TIME);
                            usersMap.set(message.author.id, userData)
                        } else {
                                msgCount++;
                                if(parseInt(msgCount) === LIMIT) {
				                message.delete().catch(err => {});
                                    if(await Mute.findOne({_id: message.member.id})) return;
                                    let cezano = await Punitives.countDocuments().exec();
                                    cezano = cezano == 0 ? 1 : cezano + 1;
                                    await Punitives.find({}).exec(async (err, res) => {
                                        let ceza = new Punitives({ 
                                            No: cezano,
                                            Uye: message.member.id,
                                            Yetkili: client.user.id,
                                            Tip: "Susturulma",
                                            AtilanSure: "30 Saniye",
                                            Sebep: "Sohbet kanallarında flood!",
                                            Kalkma: Date.now()+ms("30s"),
                                            Tarih: Date.now()
                                        })
                                        let Zamanlama = new Mute({
                                            No: ceza.No,
                                            _id: message.member.id,
                                            Kalkma: Date.now()+ms("30s")
                                        }) 
                                        Zamanlama.save().catch(e => console.error(e));
                                        ceza.save().catch(e => console.error(e));
                                    message.channel.send(`${message.guild.emojiGöster(emojiler.ChatSusturuldu)} ${message.member} Sohbet kanallarında fazla hızlı mesaj gönderdiğiniz için \`30 Saniye\` süresince susturuldunuz. (Ceza Numarası: \`#${cezano}\`)`)
                                    message.member.roles.add(roller.muteRolü).catch(err => {})
                                    })
                                    return usersMap.delete(message.author.id);
                                 } else {
                      userData.msgCount = msgCount;
                      usersMap.set(message.author.id, userData)
                    }}}
                     else{
                    let fn = setTimeout(() => {
                      usersMap.delete(message.author.id)
                    }, TIME);
                    usersMap.set(message.author.id, {
                    msgCount: 1,
                    lastMessage: message,
                    timer: fn
                    
                    })
                    }
                
};

module.exports.config = {
    Event: "message"

};
