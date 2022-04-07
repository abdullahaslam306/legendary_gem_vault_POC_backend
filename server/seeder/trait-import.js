const data = require('../../nft.json')
require('../models/NFT');
let mongoose = require("mongoose");
let NFT = mongoose.model('NFT');
mongoose.connect('mongodb://localhost:27017/LegendaryVault', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    }).catch(err => {
        console.log(err.stack);
        process.exit(1);
    })
    .then((connection) => {
        updatingNft();
    });


const mapData = (traits) => {

let traitsArray = traits.map(trait =>{ return { trait_type: trait.trait_type, value: trait.value}})
return traitsArray

}


const updatingNft = () => {
for( let i = 0; i < data.length; i++ ) { 
    NFT.findOneAndUpdate({ tokenId: data[i].tokenId}, { "traits" : mapData(data[i].traits) })
    .then(success => {
        console.log('Done',data[i].tokenId)
    })
    .catch(error => {
        console.log(error.message, data[i].tokenId)
    })
}}