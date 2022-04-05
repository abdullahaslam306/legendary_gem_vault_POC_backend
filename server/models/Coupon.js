let mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');

let CouponSchema = new mongoose.Schema({
    coupon: {type: String},
    used: {type: Boolean, default: false},
    perk: {type: mongoose.Schema.Types.ObjectId, ref: 'Perk'}
}, {timestamps: true});

CouponSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Coupon", CouponSchema);