const { GuildMember, TextChannel, MessageEmbed } = require("discord.js");
const { Upstaff } = require("../../Database/acarDatabase");
const Managements = require('../../Database/Schema/Managements');
const Coins = require('../../Database/Schema/Coins');

 /**
 * @param { Client } client
 */

 module.exports = function (client) {
	GuildMember.prototype.yetkiBıraktı = async function (lastRole) {
		let altYetki = this.guild.roles.cache.get(roller.altilkyetki)
        let arr = []
        this.roles.cache.filter(rol => altYetki.position <= rol.position).forEach(async (rol) => {
            await arr.push(rol.id)
        })
        if(!lastRole) lastRole = this.roles.cache
        if(arr.length <= 0) {
            lastRole.forEach(rol => {
                arr.push(rol.id)
            })
        }
        
        let yetkiyiBırakan = this.guild.kanalBul("yetki-bırakan")
		let embed = new MessageEmbed().setFooter("bu bilgilendirme mesajına uyarak, lütfen eski yetkilimizi sunucumuza davet edin.").setDescription(`${this} isimli eski yetkili, yetkiyi sunucudan ayrılarak **${tarihsel(Date.now())}** tarihinde yetkisini saldı.`).addField("Son rolleri şunlardır", `${arr.map(x => this.guild.roles.cache.get(x)).join(", ")}`)
        if(yetkiyiBırakan) yetkiyiBırakan.send(embed) 
	}
	GuildMember.prototype.taskAdd = async function (tip, veri) {
		let UserData = await Managements.findOne({_id: this.user.id});
			if(!UserData) {
				if(veri >= 0) {
					await Managements.updateOne({_id: this.user.id}, { $set: {"baslamaTarih": Date.now()}}, {upsert: true});
					if(tip === "Ses") if(taskConf.puanlama.sistem) await Managements.updateOne({_id: this.user.id}, {$inc: { "Puan": veri ? veri : taskConf.puanlama.sesPuan, "SesPuan": veri ? veri : taskConf.puanlama.sesPuan}}, {upsert: true});
					if(tip === "Invite") {
						if(taskConf.puanlama.sistem) await Managements.updateOne({_id: this.user.id}, {$inc: { "Puan": veri <= 0 ? Number(taskConf.puanlama.invitePuan) : Number(taskConf.puanlama.invitePuan), "InvitePuan": veri <= 0 ? Number(taskConf.puanlama.invitePuan) : Number(taskConf.puanlama.invitePuan)}}, {upsert: true});
						await Managements.updateOne({ _id: this.user.id }, { $inc: { "Invite": veri } }, {upsert: true});
						return;
					}
					if(tip === "Taglı") {
						if(taskConf.puanlama.sistem) await Managements.updateOne({_id: this.user.id}, {$inc: { "Puan": veri <= 0 ? Number(taskConf.puanlama.tagliPuan) : Number(taskConf.puanlama.tagliPuan), "TagliPuan": veri <= 0 ? Number(taskConf.puanlama.tagliPuan) : Number(taskConf.puanlama.tagliPuan)}}, {upsert: true});
						await Managements.updateOne({ _id: this.user.id }, { $inc: { "Taglı": veri } }, {upsert: true});
						return;
					}
					if(tip === "Kayıt") {
						if(taskConf.puanlama.sistem) await Managements.updateOne({_id: this.user.id}, {$inc: { "Puan": veri <= 0 ? Number(taskConf.puanlama.kayitPuan) : veri <= 0 ? Number(taskConf.puanlama.kayitPuan) : Number(taskConf.puanlama.kayitPuan) , "KayitPuan": veri <= 0 ? Number(taskConf.puanlama.kayitPuan) : Number(taskConf.puanlama.kayitPuan)}}, {upsert: true});
						await Managements.updateOne({ _id: this.user.id }, { $inc: { "Kayıt": veri } }, {upsert: true});
						return;
					}
					if(tip === "Yetkili") {
						if(taskConf.puanlama.sistem) await Managements.updateOne({_id: this.user.id}, {$inc: { "Puan": veri <= 0 ? Number(taskConf.puanlama.yetkiliPuan) : Number(taskConf.puanlama.yetkiliPuan), "YetkiliPuan": veri <= 0 ? Number(taskConf.puanlama.yetkiliPuan) : Number(taskConf.puanlama.yetkiliPuan)}}, {upsert: true});
						await Managements.updateOne({ _id: this.user.id }, { $inc: { "Yetkili": veri } }, {upsert: true});
						return;
					}
				} 
			} 
				if(tip === "Ses") if(taskConf.puanlama.sistem) await Managements.updateOne({_id: this.user.id}, {$inc: { "Puan": veri ? veri : taskConf.puanlama.sesPuan, "SesPuan": veri ? veri : taskConf.puanlama.sesPuan}}, {upsert: true});
				if(tip === "Invite") {
					if(taskConf.puanlama.sistem) await Managements.updateOne({_id: this.user.id}, {$inc: { "Puan": veri <= 0 ? Number(taskConf.puanlama.invitePuan) : Number(taskConf.puanlama.invitePuan), "InvitePuan": veri <= 0 ? Number(taskConf.puanlama.invitePuan) : Number(taskConf.puanlama.invitePuan)}}, {upsert: true});
					await Managements.updateOne({ _id: this.user.id }, { $inc: { "Invite": veri } }, {upsert: true});
				}
				if(tip === "Taglı") {
					if(taskConf.puanlama.sistem) await Managements.updateOne({_id: this.user.id}, {$inc: { "Puan": veri <= 0 ? Number(taskConf.puanlama.tagliPuan) : Number(taskConf.puanlama.tagliPuan), "TagliPuan": veri <= 0 ? Number(taskConf.puanlama.tagliPuan) : Number(taskConf.puanlama.tagliPuan)}}, {upsert: true});
					await Managements.updateOne({ _id: this.user.id }, { $inc: { "Taglı": veri } }, {upsert: true});
				}
				if(tip === "Kayıt") {
					if(taskConf.puanlama.sistem) await Managements.updateOne({_id: this.user.id}, {$inc: { "Puan": veri <= 0 ? Number(taskConf.puanlama.kayitPuan) : Number(taskConf.puanlama.kayitPuan), "KayitPuan": veri <= 0 ? Number(taskConf.puanlama.kayitPuan) : Number(taskConf.puanlama.kayitPuan)}}, {upsert: true});
					await Managements.updateOne({ _id: this.user.id }, { $inc: { "Kayıt": veri } }, {upsert: true});
				}
				if(tip === "Yetkili") {
					if(taskConf.puanlama.sistem) await Managements.updateOne({_id: this.user.id}, {$inc: { "Puan": veri <= 0 ? Number(taskConf.puanlama.yetkiliPuan) : Number(taskConf.puanlama.yetkiliPuan), "YetkiliPuan": veri <= 0 ? Number(taskConf.puanlama.yetkiliPuan) : Number(taskConf.puanlama.yetkiliPuan)}}, {upsert: true});
					await Managements.updateOne({ _id: this.user.id }, { $inc: { "Yetkili": veri } }, {upsert: true});
				}
	}

	GuildMember.prototype.coinAdd = async function (Miktar) {
		await Coins.updateOne({_id: this.user.id}, { $inc: {"Coin": Miktar}}, {upsert: true}).exec();
	}

};