let router = require('express').Router();
let mongoose = require("mongoose");
let Staking = mongoose.model('Staking');
let NFT = mongoose.model('NFT');
let Config = mongoose.model('Config');
let moment = require('moment');
let httpResponse = require('express-http-response');
let OkResponse = httpResponse.OkResponse;
let ForbiddenResponse = httpResponse.ForbiddenResponse;
let BadRequestResponse = httpResponse.BadRequestResponse;

let auth = require('../../middlewares/auth');

router.post('/', auth.required, auth.user, (req, res, next) => {
    let staking = new Staking();
    staking.asset = req.body.asset;
    staking.startDate = Date.now();

    staking.save().then(() => {
        next(new OkResponse(staking));
    })
});

router.post('/stakeAll',auth.required, auth.user, (req, res, next) => {
    let assetsToStake = req.body.assetsToStake;
    let itemsProcessed = 0;
    assetsToStake.forEach(async (asset, index, array) => {
        let staking = new Staking();
        staking.asset = asset;
        staking.startDate = Date.now();

        await staking.save();
        itemsProcessed++;
        if(itemsProcessed == array.length){
            next(new OkResponse({message: 'All NFTs staked'}));
        }
    });
});

router.post('/unstake', auth.required, auth.user, (req, res, next) => {
    Staking.findOne({asset: req.body.asset, endDate: null}, async (err, result) => {
        if(err || !result){
            next(new BadRequestResponse('No Result Fount'));
        }else{
            result.endDate = Date.now();
            let start = moment(result.startDate);
            let end = moment(result.endDate);
            let duration = moment.duration(end.diff(start));
            let days = duration.asDays();
            days = Number(days.toFixed(0));
            let gems = 0;
            if(days < 30){
                gems = 10 * days;
            }else if(days > 30 && days <= 90){
                gems = 10 * 30;
                gems += 20 * (days - 30);
            }else if(days > 90){
                gems = 10 * 30;
                gems += 20 * 60;
                gems += 30 * (days - 90);
            }
            result.gems = gems;
            let nft = await NFT.findOne({tokenId: req.body.asset});
            nft.noOfGems += Number(gems);
            await nft.save();

            result.save().then(() => {
                next(new OkResponse({result: result}))
            })
        }
    });
});

router.post('/filter', async (req, res, next) => {
    let userNFTs = req.body.userAssets;
    userNFTs = userNFTs.map(asset => {return asset.token_id})
    let allStakedNFTs = await Staking.find({endDate: null});   // All the NFTs that are still staked
    allStakedNFTs = allStakedNFTs.map(nft => {return nft.asset})

    let allNFTs = await NFT.find({tokenId: {$in: userNFTs}});

    let stakedNFTsArray = [];
    let unstakedNFTsArray = [];
    let itemsProcessed = 0;
    userNFTs.forEach(async (nft, index, array) => {
        if(allStakedNFTs.indexOf(nft) != -1){
            let temp = await Staking.findOne({asset: nft, endDate: null});
            stakedNFTsArray.push(temp);
        }else{
            let temp = await NFT.findOne({tokenId: nft});
            unstakedNFTsArray.push(temp);
        }
        itemsProcessed++;
        if(itemsProcessed == array.length){
            next(new OkResponse({
                allNFTs: allNFTs,
                stakedNFTs: stakedNFTsArray, 
                unstakedNFTs: unstakedNFTsArray
            }));
        }
    })
});

router.post('/claim', auth.required, auth.user, (req, res, next) => {
    let flag = false;
    let userNFTs = req.body.userAssets;
    userNFTs = userNFTs.map(asset => {return asset.token_id});
    let itemsProcessed = 0;
    userNFTs.forEach(async (asset, index, array) => {
        let record = await Staking.findOne({asset: asset, type: 2})
        if(!record) {
            flag = true;
            let config = await Config.findOne({days: -1})
            let staking = new Staking();
            staking.startDate = Date.now();
            staking.endDate = Date.now();
            staking.asset = asset;
            staking.type = 2;
            staking.gems = config.gems;

            staking.save().then(() => {
                NFT.findOne({tokenId: asset}, async(err, nft) => {
                    nft.noOfGems += config.gems;
                    nft.save().then(() => {
                        flag = 1;
                    });
                })
                
            })
        }
        
        itemsProcessed++;
        if(itemsProcessed == array.length){
            if(flag){
                next(new OkResponse({message: 'Gems Claimed Successfully!'}))
            }else{
                next(new BadRequestResponse('Gems Already Claimed!'))
            }
        }
    })
})

module.exports = router; 