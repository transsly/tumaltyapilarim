const mongoose = require("mongoose");

const schema = mongoose.model('Jail', new mongoose.Schema({
    No: Number,
    _id: String,
    Kalkma: String
}));

module.exports = schema;

