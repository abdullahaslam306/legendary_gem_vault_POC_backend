let router = require('express').Router();
let mongoose = require("mongoose");
let Perk = mongoose.model('Perk');
let Order = mongoose.model('Order');
let NFT = mongoose.model('NFT');
let OrderAsset = mongoose.model('OrderAsset');
let httpResponse = require('express-http-response');
let OkResponse = httpResponse.OkResponse;
let BadRequestResponse = httpResponse.BadRequestResponse;
let auth = require('../../middlewares/auth');

router.post('/', auth.required, auth.user, (req, res, next) => {
    let deductions = req.body.deductions;
    let perks = req.body.perks;
    let perksIds = perks.map(perk => {return perk.id});
    let itemsProcessed = 0;
    let totalQty = 0;
    perks.forEach((perk, index, array) => {
        Perk.findOne({_id: perk.id}, (err, result) => {
            totalQty += Number(perk.quantity);
            if((Number(result.quantity) - Number(perk.quantity)) <= 0){
                next(new BadRequestResponse('One of the requested Perk is out of stock!'));
            }
            itemsProcessed++;
            if(itemsProcessed == array.length){
                let order = new Order();
                order.firstName = req.body.firstName;
                order.lastName = req.body.lastName;
                order.country = req.body.country;
                order.phone = req.body.phone;
                order.email = req.body.email;
                order.walletAddress = req.body.walletAddress;
                order.remarks = req.body.remarks;
                order.user = req.user._id;
                order.date = Date.now();
                order.quantity = totalQty;
                order.perks = perksIds;

                for(let i = 0;i < perks.length;i++){
                    Perk.findOne({_id: perks[i].id}, async(err, result) => {
                        result.quantity -= Number(perks[i].quantity);
                        await result.save();
                    })
                }

                order.save().then( async() => {
                    for(let i = 0;i < deductions?.length;i++){
                        NFT.findOne({tokenId: deductions[i].asset}, async(err, nft) => {
                            nft.noOfGems -= Number(deductions[i].amount);
                            await nft.save();
                        })

                        let orderAsset = new OrderAsset();
                        orderAsset.order = order._id;
                        orderAsset.address = deductions[i].asset;
                        orderAsset.gems = deductions[i].amount;
                        await orderAsset.save();
                    }
                    next(new OkResponse({order: order}));
                    
                }).catch((e) => { next(new BadRequestResponse(e.error)); });
            }
        })
    })
});


module.exports = router;
