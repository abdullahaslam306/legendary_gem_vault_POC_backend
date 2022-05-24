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
            limit: +req.query.limit || 100
        }

        if (typeof req.query.gems !== undefined && req.query.gems && req.query.gems !== null) {
            query.price = { $lte: req.query.gems };
        }

        if(typeof req.query.sort !== undefined && req.query.sort && req.query.sort !== null){
            if(req.query.sort == 1){
                options.sort = 'price';
            }else if(req.query.sort == -1){
                options.sort = '-price';
            }
        }

        query.enabled = true;
 
        
        Perk.paginate(query, options, async(err, result) => {
            if(err) {
                next(new BadRequestResponse({err: err}));
            }else{
                let allPerks = result.docs.map(doc => doc.slug);
                
                for await(let perkSlug of allPerks) {
                    let soldCount = await Coupon.countDocuments({perk: perkSlug, used: true});
                    let qtyCount = await Coupon.countDocuments({perk: perkSlug, used: false}); //Remaining Quantity
                    
                    let index = result.docs.map(doc => doc.slug).indexOf(perkSlug);
                    const newObj = {
                        _id: result.docs[index]._id,
                        showOnTop: result.docs[index].showOnTop,
                        description: result.docs[index].description,
                        image: result.docs[index].image,
                        price: result.docs[index].price,
                        type: result.docs[index].type,
                        slug: result.docs[index].slug,
                        sold: soldCount,
                        left: qtyCount
                    }
                    result.docs[index] = newObj;
                }
                next(new OkResponse({perks: result}));
            }
        });
    }catch(err) {
        console.error(err);
        next(new BadRequestResponse({err: err}));
    }
});


module.exports = router;
