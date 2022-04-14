let mongoose = require("mongoose");
let {EVENT_TYPE} = require('../constants/constants');

let EventSchema = new mongoose.Schema({
    tokenIds: [{type: String}],
    address: {type: String},
    block_timestamp: {type: Date},
    eventType: {
        type: String,
        enum: Object.values(EVENT_TYPE),
    },
}, {timestamps: true});

module.exports = mongoose.model("Event", EventSchema);