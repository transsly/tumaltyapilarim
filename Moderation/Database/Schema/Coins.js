const mongoose = require("mongoose");

const schema = mongoose.model('Coin', new mongoose.Schema({

    _id: String,
    Bio: String,
    Coin: {type: Number, default: 0},
    GunlukCoin: {type: Number, default: 0},
    Arkadaşlar: { type: Object },
    Transferler: { type: Object },
    Envanter: {type: Object }

}));

module.exports = schema;