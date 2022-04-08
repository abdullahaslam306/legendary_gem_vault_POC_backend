let router = require('express').Router();
let mongoose = require("mongoose");
let Perk = mongoose.model('Perk');
let Coupon= mongoose.model('Coupon');
let httpResponse = require('express-http-response');
let OkResponse = httpResponse.OkResponse;
let ForbiddenResponse = httpResponse.ForbiddenResponse;
let BadRequestResponse = httpResponse.BadRequestResponse;

router.post('/', (req, res, next) => {  //There will be an auth middleware to check authenticated user
    let perk = new Perk();
    perk.description = req.body.perk.description;
    perk.image = req.body.perk.image;
    perk.price = req.body.perk.price;
    perk.quantity = req.body.perk.quantity;

    perk.save().then(() => {
        next(new OkResponse({perk: perk}));
    });
});

router.get('/', (req, res, next) => {
    try{
        let query = {};
        const options = {
            page: +req.query.page || 1,
            limit: +req.query.limit || 12,
        }

        if (typeof req.query.gems !== undefined && req.query.gems && req.query.gems !== null) {
            query.price = { $lte: req.query.gems };
        }
 
        Perk.paginate(query, options, (err, result) => {
            if(err) {
                next(new BadRequestResponse({err: err}));
            }else{
                next(new OkResponse({perks: result}));
            }
        });
    }catch(err) {console.log(err);}
});

module.exports = router;
