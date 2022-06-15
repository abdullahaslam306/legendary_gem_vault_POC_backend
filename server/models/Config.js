let mongoose = require("mongoose");

let ConfigSchema = new mongoose.Schema({
    days: {type: Number},
    gems: {type: Number},
    gems10Legends: {type: Number},
    gems25Legends: {type: Number},
    gems50Legends: {type: Number},
}, {timestamps: true});

module.exports = mongoose.model("Config", ConfigSchema);