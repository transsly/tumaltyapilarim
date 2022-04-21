const mongoose = require("mongoose");

const schema = mongoose.model('Punitive', new mongoose.Schema({
    No: Number,
    Uye: String,
    Yetkili: String,
    Tip: String,
    Sebep: String,
    AtilanSure: String,
    Kalkma: Date,
    Tarih: Date,
    Bitis: Date,
    Kaldiran: String,
    Aktif: { type: Boolean, default: true},
    
}));

module.exports = schema;

