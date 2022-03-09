let mongoose = require("mongoose");

let StakingSchema = new mongoose.Schema({
    asset: {type: String},
    startDate: {type: Date},
    endDate: {type: Date},
    gems: {type: Number}
}, {timestamps: true});

module.exports = mongoose.model("Staking", StakingSchema);