let router = require('express').Router();
let mongoose = require("mongoose");
let Perk = mongoose.model('Perk');
let Order = mongoose.model('Order');
let NFT = mongoose.model('NFT');
let Claim = mongoose.model('Claim');
let OrderAsset = mongoose.model('OrderAsset');
let Coupon = mongoose.model('Coupon');
let httpResponse = require('express-http-response');
let OkResponse = httpResponse.OkResponse;
let BadRequestResponse = httpResponse.BadRequestResponse;
let NotFoundResponse = httpResponse.NotFoundResponse;
let auth = require('../../middlewares/auth');
const {
    sendCouponEmail
} = require('../../utilities/emailService');

router.post('/', auth.required, auth.user, (req, res, next) => {
    let deductions = req.body.deductions;
    let perks = req.body.perks;
    // let perksIds = perks.map(perk => {return perk.id});
    let itemsProcessed = 0;
    let totalQty = 0;
    let quantityArray = [];
    perks.forEach((perk, index, array) => {
        Perk.findOne({slug: perk.slug}, (err, result) => {
            if (!result) {
                console.log("perk not found for ", perk.slug);
            }

            
            // totalQty += Number(perk.quantity);
            quantityArray.push({
                perk: perk.slug,
                quantity: Number(perk.quantity)
            })
            if((Number(result.quantity) - Number(perk.quantity)) < 0){
                next(new NotFoundResponse('Requested Perk is out of stock'))
                return;
            }

            itemsProcessed++;
            if(itemsProcessed == array.length){
                let order = new Order();
                order.name = req.body.name;
                order.discord = req.body.discord;
                order.walletAddress = req.body.walletAddress;
                order.email = req.body.email;
                order.remarks = req.body.remarks;
                order.user = req.user._id;
                order.date = Date.now();
                order.quantityArray = quantityArray;
                // order.perks = perksIds;


                for(let i = 0;i < perks.length;i++) {
                    for(let j = 0;j < Number(perks[i].quantity);j++) {
                        Coupon.findOneAndUpdate({perk: perks[i].slug, used: false},{used: true},{returnNewDocument:true}, (err, result) => {
                            if(perks[i].type == 1){
                                sendCouponEmail(req.body.email, req.body.name, result.coupon);
                            }
                        });
                        // sendCouponEmail(req.body.email, req.body.name, 'testing-coupon');
                    } 
                }

                for(let i = 0;i < perks.length;i++) {
                    Perk.findOne({slug: perks[i].slug}, async(err, result) => {
                        result.quantity -= Number(perks[i].quantity);
                        await result.save();
                    })
                }

                order.save().then( async() => {
                    if(req.body.claimDeduction != 0){
                        let userClaimRecord = await Claim.findOne({walletAddress: req.user.walletAddress});
                        userClaimRecord.usedGems += Number(req.body.claimDeduction);
                        await userClaimRecord.save();
                    }
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
