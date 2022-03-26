let mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');

let OrderSchema = new mongoose.Schema({
    perks: [{type: mongoose.Schema.Types.ObjectId, ref: 'Perk'}],
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    date: {type: Date},
    quantity: {type: Number},
    firstName: {type: String},
    lastName: {type: String},
    country: {type: String},
    phone: {type: String},
    email: {type: String},
    email2: {type: String},
    remarks: {type: String},
}, {timestamps: true});

OrderSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Order", OrderSchema);