const mongoose = require("mongoose");

const schema = mongoose.model('Snipe', new mongoose.Schema({
    _id: String,
    yazar: String,
    yazilmaTarihi: String,
    silinmeTarihi: String,
    dosya: Boolean,
    icerik: String
}));

module.exports = schema;
