const mongoose = require("mongoose");

const schema = mongoose.model("Management", new mongoose.Schema({
    _id: String,

    // Puan Bilgisi
    baslamaTarih: {type: Date, default: Date.now()},
    Puan: {type: Number, default: 0},

    // Alınan Tüm Puanlar
    SesPuan: {type: Number, default: 0},
    TagliPuan: {type: Number, default: 0},
    YetkiliPuan: {type: Number, default: 0},
    KayitPuan: {type: Number, default: 0},
    InvitePuan: {type: Number, default: 0},
    BonusPuan: {type: Number, default: 0},

    // Yönetim Görev Bilgisi
    Taglı: {type: Number, default: 0},
    Yetkili: {type: Number, default: 0},
    Invite: {type: Number, default: 0},
    Kayıt: {type: Number, default: 0},
    TaglıÖdül: {type: Boolean, default: false},
    YetkiliÖdül: {type: Boolean, default: false},
    InviteÖdül: {type: Boolean, default: false},
    KayıtÖdül: {type: Boolean, default: false}
}));

module.exports = schema;