let mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');

let PerkSchema = new mongoose.Schema({
    description: {type: String},  //Can be Merchandise, Event etc
    image: {type: String},  //string of image url
    price: {type: Number},  //Price in No. of gems
    type: {
        type: Number,
        enum: [
            1,  //Coupon
            2,  //Coin
        ]
    },  // For future use
    quantity: {type: Number}, //Total number of items available for this particular Perk
    showOnTop: {type: Boolean, default: false}, 
}, {timestamps: true});

PerkSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Perk", PerkSchema);