let mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');

let NFTSchema = new mongoose.Schema({
    address: {type: String},
    tokenId: {type: String},
    tokenUri: {type: String},
    noOfGems: {type: Number, default: 0},
    traits: [{
        value: {type: String},
        trait_type: {type: String}
    }]
}, {timestamps: true});

NFTSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("NFT", NFTSchema);