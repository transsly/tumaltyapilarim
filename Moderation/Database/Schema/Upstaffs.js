const mongoose = require("mongoose");

const schema = mongoose.model('newUpstaff', new mongoose.Schema({
    _id: String,
    Point: {type: Number, default: 0},
    staffNo: {type: Number, default: 1},
    staffExNo: {type: Number, default: 0},
    Register: {type: Number, default: 0},
    Invite: {type: Number, default: 0},
    Tag: {type: Number, default: 0},
    Ses: { type: Map, default: {}},
    Mesaj: {type: Number, default: 0},
    Bonus: {type: Number, default: 0},
    Baslama: Date,
    ToplamSes: {type: Number, default: 0},
    ToplamMesaj: {type: Number, default: 0},
    ToplamSesListe: { type: Map, default: {}},
    ToplamBonus: {type: Number, default: 0},
    ToplamPuan: {type: Number, default: 0},
}));

module.exports = schema;