let router = require('express').Router();
let mongoose = require("mongoose");
let NFT = mongoose.model('NFT');
let httpResponse = require('express-http-response');
let OkResponse = httpResponse.OkResponse;
let ForbiddenResponse = httpResponse.ForbiddenResponse;
let BadRequestResponse = httpResponse.BadRequestResponse;

router.get('/', (req, res, next) => {
    const options = {
        page: +req.query.page || 1,
        limit: +req.query.limit || 10,
    }

    NFT.paginate({}, options, (err, result) => {
        if(err) {
            next(new BadRequestResponse({err: err}));
        }else{
            next(new OkResponse({result: result}));
        }
    })
})

module.exports = router;