const mongoose = require("mongoose");

const schema = mongoose.model('Stat', new mongoose.Schema({
    guildID: String,
    userID: String,
    voiceStats: Map,
    taskVoiceStats: Map,
    upstaffVoiceStats: Map,
    voiceCameraStats: Map,
    voiceStreamingStats: Map,
    totalVoiceStats: Number,
    chatStats: Map,
    upstaffChatStats: Map,
    totalChatStats: Number
}));

module.exports = schema;