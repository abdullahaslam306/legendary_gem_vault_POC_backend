let mongoose = require("mongoose");

let StakingSchema = new mongoose.Schema({
    asset: {type: String},
    startDate: {type: Date},
    endDate: {type: Date, default: null},
    gems: {type: Number, default: 0},
    type: {
        type: Number,
        enum: [
            1,  //Normal Staking
            2,  //One Time Staking
        ],
        default: 1
    }, 
}, {timestamps: true});

module.exports = mongoose.model("Staking", StakingSchema);