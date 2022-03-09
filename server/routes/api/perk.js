let router = require('express').Router();
let mongoose = require("mongoose");
let Perk = mongoose.model('Perk');
let httpResponse = require('express-http-response');
let OkResponse = httpResponse.OkResponse;
let ForbiddenResponse = httpResponse.ForbiddenResponse;
let BadRequestResponse = httpResponse.BadRequestResponse;

router.post('/', (req, res, next) => {  //There will be an auth middleware to check authenticated user
    let perk = new Perk();
    perk.description = req.body.perk.description;
    perk.image = req.body.perk.image;
    perk.price = req.body.perk.price;
    perk.sold = null

    //No value assigned to 'sold.user and sold.date because perk is unsold when being created

    perk.save().then(() => {
        next(new OkResponse({perk: perk}));
    });
});

router.get('/', (req, res, next) => {
    try{
    const options = {
        page: +req.query.page || 1,
        limit: +req.query.limit || 10,
    }

    Perk.paginate({}, options, (err, result) => {
        if(err) {
            next(new BadRequestResponse({err: err}));
        }else{
            next(new OkResponse({perk: result}));
        }
    });
    }catch(err) {console.log(err);}
});

module.exports = router;
