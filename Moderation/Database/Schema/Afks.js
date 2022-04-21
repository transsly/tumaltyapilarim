const mongoose = require("mongoose");

const schema = mongoose.model('Afk', new mongoose.Schema({
    _id: String,
    sebep: String,
    sure: String
}));

module.exports = schema;
