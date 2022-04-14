let router = require('express').Router();
const Moralis = require('moralis/node');
let mongoose = require("mongoose");
let Claim = mongoose.model('Claim');
let Config = mongoose.model('Config');
let httpResponse = require('express-http-response');
let OkResponse = httpResponse.OkResponse;
let ForbiddenResponse = httpResponse.ForbiddenResponse;
let BadRequestResponse = httpResponse.BadRequestResponse;
let auth = require('../../middlewares/auth');
let { MORALIS, NFT_CONTRACT_ADDRESS, CHAIN} = require('../../constants/constants');


router.get('/', auth.required, auth.user, async(req, res, next) => {
    try{
        let record = await Claim.findOne({walletAddress: req.user.walletAddress})
        if(record){
            next(new OkResponse({status: 201, message: 'Reward already claimed!'}));
            return;
        }else{
            await Moralis.start({ serverUrl: MORALIS.serverUrl, appId: MORALIS.appId });
            let userAssets = await Moralis.Web3API.account.getNFTs({chain: CHAIN, address: req.user.walletAddress});
            userAssets = userAssets?.result;
            userAssets = userAssets.filter(x => x.token_address.toLowerCase() == NFT_CONTRACT_ADDRESS.toLowerCase());
            if(userAssets.length == 0){
                console.error('No Asset Found!');
                next(new OkResponse({status: 203, message: 'Cannot claim gems with No Assets'}));
                return;   
            }

            const config = await Config.findOne({days: -1})
            if (!config) {
                console.error('claim config not found');
                next(new BadRequestResponse('Internal error'));
                return;    
            }

            let claimRecord = new Claim();
            claimRecord.walletAddress = req.user.walletAddress;
            claimRecord.hasClaimed = true;
            claimRecord.gems = config.gems;

            claimRecord.save().then(() => {
                next(new OkResponse({status: 204, message: 'Gems Claimed Successfully!', gems: claimRecord.gems}));
            });
        }
    }catch(err){
        console.log(err)
        next(new BadRequestResponse('An Error occured!'))
    }
});

router.get('/record', auth.required, auth.user, async (req, res, next) => {
    let record = await Claim.findOne({walletAddress: req.user.walletAddress});
    if(record){
        next(new OkResponse({record: record}));
    }else{
        next(new BadRequestResponse('Claim Record Not Found'));
    }
})

module.exports = router;