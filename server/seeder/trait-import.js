const data = require('../../nft.json')
require('../models/NFT');

let mongoose = require("mongoose");
let NFT = mongoose.model('NFT');


console.log(data[0].tokenId)
data.forEach( nft => {
    NFT.findOneAndUpdate({ tokenId: nft.tokenId}, { "traits" : nft.traits }, {useFindAndModify: false})
    .then(success => {
        consonle.log(nft.tokenId, 'Done')
    })
    .catch(error => {
        console.log(error.message, nft.tokenId)
    })

})