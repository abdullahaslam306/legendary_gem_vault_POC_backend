let mongoose = require("mongoose");

let StakingSchema = new mongoose.Schema(
  {
    asset: { type: String },
    startDate: { type: Date },
    endDate: { type: Date, default: null },
    gems: { type: Number, default: 0 },
    address: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Staking", StakingSchema);
