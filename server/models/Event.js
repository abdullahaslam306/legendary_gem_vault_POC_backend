let mongoose = require("mongoose");
let { EVENT_TYPE } = require("../constants/constants");

let EventSchema = new mongoose.Schema(
  {
    docId: { type: String },
    tokenIds: [{ type: String }],
    address: { type: String },
    owner_address: { type: String },
    block_timestamp: { type: Date },
    eventType: {
      type: String,
      enum: Object.values(EVENT_TYPE)
    },
    isProcessed: { type: Boolean, default: false },
    hasException: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", EventSchema);
