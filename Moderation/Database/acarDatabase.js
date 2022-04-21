// Models(Schema)
let Users = require('./Schema/Users');
let Punitives = require('./Schema/Punitives');
let Stats = require('./Schema/Stats');
let Upstaffs = require('./Schema/Upstaffs');
class RegisterDB {
     static async kayıtBelirt(uye, isim, yas, yetkili, islemismi, cinsiyet) {
        await Users.updateOne({ id: yetkili.id } , { $inc: { "Toplamteyit": 1 } }, { upsert: true }).exec();
        await Users.updateOne({ id: yetkili.id }, { $push: {"Teyitler": { Uye: uye.id, Cinsiyet: cinsiyet, Zaman: Date.now() }}}, { upsert: true }).exec();
        await Users.updateOne({ id: uye.id }, { $push: { "Isimler": { Yetkili: yetkili.id, Zaman: Date.now(), Isim: isim, Yas: yas, islembilgi: islemismi } } }, { upsert: true }).exec();
        await Users.updateOne({ id: uye.id }, { $set: { "Cinsiyet": cinsiyet, "Isim": isim, "Yas": yas, "Yetkili": yetkili.id } }, { upsert: true }).exec();
    };
};

class Upstaff {
    
    static async addPoint(id, pnt, tip, categoryID) {
        if(!uPConf.sistem) return client.logger.log(`UpStaff Sistemi Kapalı fakat kullanılmaya çalışılıyor.`, "ups");
        const guild = client.guilds.cache.get(ayarlar.sunucuID);
        let uye = guild.members.cache.get(id)
        if(!uye) return;
        if(!uPConf.yetkiler.some(x => uye.roles.cache.has(x))) return;
        if(uye.roles.cache.has(uPConf.sonyetki)) return;
        const uP = await Upstaffs.findOne({ _id: uye.id })
        if(!uP) { 
            await Upstaffs.updateOne({ _id: uye.id }, { $set: { "staffNo": 1, "staffExNo": 0, "Point": pnt, "ToplamPuan": pnt, "Baslama": Date.now() } }, {upsert: true}); 
            if(tip == "Invite") await Upstaffs.updateOne({ _id: uye.id }, { $inc: { "Invite": pnt } }, {upsert: true});
            if(tip == "Taglı") await Upstaffs.updateOne({ _id: uye.id }, { $inc: { "Tag": pnt } }, {upsert: true});
            if(tip == "Kayıt") await Upstaffs.updateOne({ _id: uye.id }, { $inc: { "Register": pnt } }, {upsert: true});
            if(tip == "Mesaj") await Upstaffs.updateOne({ _id: uye.id }, { $inc: { "Mesaj": pnt, "ToplamMesaj": pnt } }, {upsert: true});
            if(tip == "Bonus") await Upstaffs.updateOne({ _id: uye.id }, { $inc: { "Bonus": pnt, "ToplamBonus": pnt } }, {upsert: true});        
            if(tip == "Ses") {
                await Upstaffs.updateOne({ _id: uye.id }, { $inc: { "ToplamSes": pnt} }, {upsert: true}); 
                await Upstaffs.findOne({_id: uye.id},  async (err, data) => {
                        let sespuan = data.Ses.get(categoryID) || 0;
                        let toplamsespuan = data.ToplamSesListe.get(categoryID) || 0;
                        var setle = Number(sespuan) + Number(pnt)
                        var setleiki = Number(toplamsespuan) + Number(pnt)
                        data.Ses.set(categoryID, Number(setle));
                        data.ToplamSesListe.set(categoryID, Number(setleiki));
                        data.save();
                })    
            }
            return;
        }
        await Upstaffs.updateOne({ _id: uye.id }, { $inc: {"Point": pnt, "ToplamPuan": pnt } }, {upsert: true});
        if(tip == "Invite") await Upstaffs.updateOne({ _id: uye.id }, { $inc: { "Invite": pnt } }, {upsert: true});
		if(tip == "Taglı") await Upstaffs.updateOne({ _id: uye.id }, { $inc: { "Tag": pnt } }, {upsert: true});
		if(tip == "Kayıt") await Upstaffs.updateOne({ _id: uye.id }, { $inc: { "Register": pnt } }, {upsert: true});
        if(tip == "Mesaj") await Upstaffs.updateOne({ _id: uye.id }, { $inc: { "Mesaj": pnt, "ToplamMesaj": pnt } }, {upsert: true});
        if(tip == "Bonus") await Upstaffs.updateOne({ _id: uye.id }, { $inc: { "Bonus": pnt, "ToplamBonus": pnt } }, {upsert: true});        
        if(tip == "Ses") {
            await Upstaffs.updateOne({ _id: uye.id }, { $inc: { "ToplamSes": pnt} }, {upsert: true}); 
            await Upstaffs.findOne({_id: uye.id},  async (err, data) => {
                    let sespuan = data.Ses.get(categoryID) || 0;
                    let toplamsespuan = data.ToplamSesListe.get(categoryID) || 0;
                    var setle = Number(sespuan) + Number(pnt)
                    var setleiki = Number(toplamsespuan) + Number(pnt)
                    data.Ses.set(categoryID, Number(setle));
                    data.ToplamSesListe.set(categoryID, Number(setleiki));
                    data.save();
            })    
        }
	    if(uP.staffNo >= 2) {
               if(!uye.roles.cache.has('898860177531473920')) uye.roles.add('898860177531473920') 
            } 
            if(uP.staffNo >= 5) {
                if(!uye.roles.cache.has('898860177531473920')) uye.roles.add('898860177531473920') 
                if(!uye.roles.cache.has('898860176415809547')) uye.roles.add('898860176415809547')
            }
            if(uP.staffNo >= 7) {
                if(!uye.roles.cache.has('898860177531473920')) uye.roles.add('898860177531473920') 
                if(!uye.roles.cache.has('898860176415809547')) uye.roles.add('898860176415809547')
                if(!uye.roles.cache.has('898860175983775774')) uye.roles.add('898860175983775774')
            }
            if(uP.staffNo >= 9) {
                if(!uye.roles.cache.has('898860177531473920')) uye.roles.add('898860177531473920') 
                if(!uye.roles.cache.has('898860176415809547')) uye.roles.add('898860176415809547')
                if(!uye.roles.cache.has('898860175983775774')) uye.roles.add('898860175983775774')
                if(!uye.roles.cache.has('898860175220408350')) uye.roles.add('898860175220408350')
            }        	

        let Yetki = uPConf.yetkipuan.find(x => x.No == uP.staffNo)
        let yeniPuan = Yetki.Puan
        if(!yeniPuan) return;
        if (uP && uPConf.yetkipuan.some(x => uP.Point >= yeniPuan)) {
          let yeniYetki = uPConf.yetkipuan.filter(x => x.No == uP.staffNo); 
          yeniYetki = yeniYetki[yeniYetki.length-1];
          const eskiYetki = uPConf.yetkipuan[uPConf.yetkipuan.indexOf(yeniYetki)-1];
          if (yeniYetki && !uye.roles.cache.has(yeniYetki.rol)) uye.roles.add(yeniYetki.rol);
          if (eskiYetki && uye.roles.cache.has(eskiYetki.rol)) uye.roles.remove(eskiYetki.rol);
          guild.channels.cache.get(kanallar.TerfiLog).send(`:tada: ${uye.toString()} üyesi gereken puana ulaştı ve \`${guild.roles.cache.get(yeniYetki.rol).name}\` isimli yetki rolü verildi!`);
          await Stats.updateOne({ userID: uye.id }, { upstaffVoiceStats: new Map(), upstaffChatStats: new Map() });
          await Upstaffs.updateOne({ _id: uye.id }, { $set: { "Point": 0, "staffNo": uP.staffNo += 1, "staffExNo": uP.staffNo -= 1, "Invite": 0,  "Tag": 0, "Register": 0, "Ses": new Map(), "Mesaj": 0, "Bonus": 0 }}, {upsert: true});
          uye.coinAdd(yeniPuan)
	} 
    }

}



module.exports = { 
    RegisterDB,
    Upstaff
 }
