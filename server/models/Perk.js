let mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');

let PerkSchema = new mongoose.Schema({
    description: {type: String},
    image: {type: String},
    price: {type: Number},
    type: {type: String, default: ''},
    sold: {
        user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        date: {type: Date}
    }
}, {timestamps: true});

PerkSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Perk", PerkSchema);