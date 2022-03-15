let mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');

let PerkSchema = new mongoose.Schema({
    description: {type: String},  //Can be Merchandise, Event etc
    image: {type: String},  //string of image url
    price: {type: Number},  //Price in No. of gems
    sold: {type: Number}, //No of items sold for this particular Perk
    total: {type: Number}, //Total number of items available for this particular Perk
}, {timestamps: true});

PerkSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Perk", PerkSchema);