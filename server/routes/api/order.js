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
let {PERK_TYPE} = require('../../constants/constants');
let auth = require('../../middlewares/auth');
const {
    sendCouponEmail
} = require('../../utilities/emailService');

router.post('/', auth.required, auth.user, async (req, res, next) => {
    let deductions = req.body.deductions;
    let perks = req.body.perks;
    let itemsProcessed = 0;
    let claimDeduction = 0;
    let totalPrice = 0;
    let rewardGems = 0;
    let deductionFromNFTs = 0;
    let quantityArray = [];

    try{
        let temp = await Claim.findOne({walletAddress: req.user.walletAddress});
        if(temp){
            rewardGems = temp.gems - temp.usedGems;
        }

        for(let i = 0;i < deductions?.length;i++){
            deductionFromNFTs += Number(deductions[i].amount)
        }
        perks.forEach((perk, index, array) => {
            Perk.findOne({slug: perk.slug}, (err, result) => {
                if (!result) {
                    console.log("perk not found for ", perk.slug);
                }

                totalPrice += (perk.quantity * perk.price);

                quantityArray.push({
                    perk: perk.slug,
                    quantity: Number(perk.quantity)
                })
                if((Number(result.quantity) - Number(perk.quantity)) < 0){
                    next(new OkResponse({status: 404}));
                    return;
                }

                if(Number(perk.quantity) != 1 ){
                    next(new OkResponse({status: 401}))
                }

                itemsProcessed++;
                if(itemsProcessed == array.length){

                    claimDeduction = totalPrice - deductionFromNFTs;

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
                                if(perks[i].type == PERK_TYPE.COUPON){
                                    sendCouponEmail(req.body.email, req.body.name, perks[i].desc, result.coupon);
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
                        console.log('Claim Deduction', claimDeduction)
                        if(claimDeduction != 0){
                            let userClaimRecord = await Claim.findOne({walletAddress: req.user.walletAddress});
                            if(userClaimRecord){
                                if((userClaimRecord.usedGems + Number(claimDeduction) <= userClaimRecord.gems)){
                                    userClaimRecord.usedGems += Number(claimDeduction);
                                    await userClaimRecord.save();
                                }else{
                                    next(new OkResponse({status: 403}));
                                }
                            }else{
                                next(new OkResponse({status: 403}));
                            }
                            
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
    }catch(err){
        console.log(err);
        next(new BadRequestResponse(e.error));
    }

    
});


module.exports = router;
