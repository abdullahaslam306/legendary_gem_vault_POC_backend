let mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');

let OrderSchema = new mongoose.Schema({
    perk: {type: mongoose.Schema.Types.ObjectId, ref: 'Perk'},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    date: {type: Date},
    quantity: {type: Number}
}, {timestamps: true});

OrderSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Order", OrderSchema);