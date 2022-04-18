let router = require('express').Router();
let mongoose = require("mongoose");
let NFT = mongoose.model('NFT');
let httpResponse = require('express-http-response');
let OkResponse = httpResponse.OkResponse;
let ForbiddenResponse = httpResponse.ForbiddenResponse;
let BadRequestResponse = httpResponse.BadRequestResponse;

router.get('/', (req, res, next) => {
    let query = {};
    const options = {
        page: +req.query.page || 1,
        limit: +req.query.limit || 30,
    }

    if (typeof req.query.min !== undefined && req.query.min && req.query.min !== null && 
        typeof req.query.max !== undefined && req.query.max && req.query.max !== null) {
        query.noOfGems = { $gte: req.query.min, $lte: req.query.max };
    }

    if(typeof req.query.legendNo !== undefined && req.query.legendNo == 1 && req.query.legendNo !== null){
        options.sort = 'tokenId';
    }

    if(typeof req.query.gems !== undefined && req.query.gems == 1 && req.query.gems !== null){
        options.sort = '-noOfGems';
    }

    NFT.paginate(query, options, (err, result1) => {
        if(err) {
            next(new BadRequestResponse({err: err}));
        }else{
            let maxGems = 0;
            NFT.find({}, (err, result) => {
                for(let i = 0;i < result.length;i++){
                    if(result[i].noOfGems > maxGems){
                        maxGems = result[i].noOfGems;
                    }
                }
                next(new OkResponse({result: result1, maxGems: maxGems}));
            })
        }
    })
});

router.get('/search', (req, res, next) => {
    NFT.find({tokenId: new RegExp(req.query.tokenId, 'i')}).then((result) =>{
        next(new OkResponse({result: result}));
    });
});


module.exports = router;