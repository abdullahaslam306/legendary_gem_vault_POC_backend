let mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');

let PerkSchema = new mongoose.Schema({
    description: {type: String},  //Can be Merchandise, Event etc
    image: {type: String},  //string of image url
    price: {type: Number},  //Price in No. of gems
    type: {type: String},  // For future use
    quantity: {type: Number}, //Total number of items available for this particular Perk
}, {timestamps: true});

PerkSchema.plugin(mongoosePaginate);


PerkSchema.set('toJSON', {
  virtuals: true,
  versionKey:false,
  transform: function (doc, ret) {   delete ret._id  }
});


module.exports = mongoose.model("Perk", PerkSchema);