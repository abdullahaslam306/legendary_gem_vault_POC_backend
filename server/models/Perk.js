let mongoose = require("mongoose");

let PerkSchema = new mongoose.Schema({
    description: {type: String},
    image: {type: String},
    price: {type: Number},
    type: {type: String},
    sold: {
        user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        date: {type: Date}
    }
}, {timestamps: true});

module.exports = mongoose.model("Perk", PerkSchema);