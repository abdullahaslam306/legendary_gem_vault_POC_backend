let router = require('express').Router();
let mongoose = require("mongoose");
let httpResponse = require('express-http-response');
let OkResponse = httpResponse.OkResponse;
let ForbiddenResponse = httpResponse.ForbiddenResponse;
let BadRequestResponse = httpResponse.BadRequestResponse;
let User = mongoose.model('User');

router.get('/check', (req, res, next) => {
    next(new OkResponse({message: 'Working Fine'}));
});

router.post('/storeUserData', (req, res, next) => {
    let user = new User();
    user.walletAddress = req.body.address;
    user.save((err, user) => {
        if(err){
            next(new BadRequestResponse());
        }else{
            next(new OkResponse({user}));
        }
    })
});

module.exports = router;