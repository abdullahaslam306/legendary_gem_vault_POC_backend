// let router = require('express').Router();

// router.use('/users', require('./user'));
// router.use('/nfts', require('./nft'));
// router.use('/stakings', require('./stakings'));
// router.use('/perks', require('./perks'));

// module.exports = router;

const router = require("express").Router();
const mongoose = require("mongoose");

const { generateCRUD } = require("./crud");


const createAdminCRUD = () => {
let model = mongoose.model('NFT');
console.log(model)
const rout = generateCRUD(router,'NFT',model);
console.log(rout)
router.use('/NFT', rout);
    // mongooseModels.forEach(currentModel => {
    
    //     let model = mongoose.model(currentModel);
    
    //     generateCRUD(router,currentModel,model);
    // })
//    console.log(router)
    return router;
}

module.exports = {
    createAdminCRUD
}