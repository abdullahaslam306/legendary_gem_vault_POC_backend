let router = require('express').Router();
let mongoose = require("mongoose");
let Perk = mongoose.model('Perk');
let Order = mongoose.model('Order');
let httpResponse = require('express-http-response');
let OkResponse = httpResponse.OkResponse;
let ForbiddenResponse = httpResponse.ForbiddenResponse;
let BadRequestResponse = httpResponse.BadRequestResponse;
let auth = require('../../middlewares/auth');

router.post('/', auth.required, auth.user, (req, res, next) => {
    Perk.findOne({_id: req.body.perk}).then(async (perk, err) => {
        if(err || !perk) {
            console.log(err);
            next(new BadRequestResponse('Perk does not exist!'));
        }else {
            if(req.body.quantity <= 0){
                next(new BadRequestResponse('Quantity has to be greater than 0!'));
            }
            else if((perk.quantity - req.body.quantity) < 0){
                next(new BadRequestResponse('Quantity exceeded available stock!'));
            }else{
                perk.quantity -= req.body.quantity;
                await perk.save();
                let order = new Order();
                order.user = req.user._id;
                order.perk = req.body.perk;
                order.date = Date.now();
                order.quantity = req.body.quantity

                order.save().then(() => {
                    next(new OkResponse({order: order}));
                });
            }
        }
    }).catch((e) => { next(new BadRequestResponse(e.error)) });
});

module.exports = router;