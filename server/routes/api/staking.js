let router = require('express').Router();
let mongoose = require("mongoose");
let Staking = mongoose.model('Staking');
let httpResponse = require('express-http-response');
let OkResponse = httpResponse.OkResponse;
let ForbiddenResponse = httpResponse.ForbiddenResponse;
let BadRequestResponse = httpResponse.BadRequestResponse;

let auth = require('../../middlewares/auth');

router.post('/',auth.required, auth.user,  (req, res, next) => {
    let staking = new Staking();
    staking.asset = req.body.asset;
    staking.startDate = Date.now();

    staking.save().then(() => {
        next(new OkResponse(staking));
    })
});

module.exports = router; 