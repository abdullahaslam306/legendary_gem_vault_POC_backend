let mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');
let slug = require('slug');
let {PERK_TYPE} = require('../constants/constants')

let PerkSchema = new mongoose.Schema({
    slug: { type: String, lowercase: true, unique: true },
    description: {type: String},  //Can be Merchandise, Event etc
    image: {type: String},  //string of image url
    price: {type: Number},  //Price in No. of gems
    type: {
        type: String,
        enum: Object.values(PERK_TYPE),
    },  // Type can be Coin OR Coupon
    quantity: {type: Number}, //Total number of items available for this particular Perk
    showOnTop: {type: Boolean, default: false},
    enabled: {type: Boolean, default: false}, 
}, {timestamps: true});

PerkSchema.plugin(mongoosePaginate);

PerkSchema.pre('validate', function (next) {
    if (!this.slug) {
      this.slugify();
    }
    next();
});

PerkSchema.methods.slugify = function () {
    this.slug = slug(this.description) + '-' + Date.now() + ((Math.random() * Math.pow(36, 6)) | 0).toString(36);
};

module.exports = mongoose.model("Perk", PerkSchema);