const mongoose = require("mongoose");

const schema = mongoose.model("Invite", new mongoose.Schema({
    guildID: String,
    userID: String,
    inviterID: String,
    regular: Number,
    bonus: Number,
    fake: Number
}));

module.exports = schema;