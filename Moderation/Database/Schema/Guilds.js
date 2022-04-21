const mongoose = require("mongoose");

const schema = mongoose.model('Guild', new mongoose.Schema({
    _id: String,
    textPrefix: String,

}));

module.exports = schema;
