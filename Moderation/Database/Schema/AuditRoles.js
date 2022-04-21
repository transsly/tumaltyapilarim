const mongoose = require("mongoose");

const schema = mongoose.model("AuditRole", new mongoose.Schema({
    user: String, 
    roller: Array
}));

module.exports = schema;