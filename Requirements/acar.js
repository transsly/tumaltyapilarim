const { acar, Mongo } = require('./Global.Client');
const client = global.client = new acar({ fetchAllMembers: true })

const acarkre = require('acarkre');
acarkre(client, {
    konsolBilgi: ayarlar.acarkre.konsolBilgi,
    küfürEngel: ayarlar.kufurEngel,
    reklamEngel: ayarlar.reklamEngel,
    uyarıMesajı: ayarlar.acarkre.uyariMesaji, 
    izinliKanallar: ayarlar.acarkre.izinliKanallar,
    izinliRoller: roller.üstYönetimRolleri,
    kufurUyariMesaj: ayarlar.acarkre.kufurUyariMesaji,
    reklamUyariMesaj: ayarlar.acarkre.reklamUyariMesaji,
});

Mongo.Connect();
client.fetchEvents();

client.login(sistem.MPLUSTOKEN);

