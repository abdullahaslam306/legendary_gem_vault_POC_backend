let router = require('express').Router();
let mongoose = require("mongoose");
let Staking = mongoose.model('Staking');
let httpResponse = require('express-http-response');
let OkResponse = httpResponse.OkResponse;

let BadRequestResponse = httpResponse.BadRequestResponse;

let auth = require('../../middlewares/auth');


router.get("/",(req, res, next) => {

 const options = {
        page: +req.query.page || 1,
        limit: +req.query.limit || 10,
    }

    Staking.paginate({}, options, (err, staking) => {
        if(err) {
            next(new BadRequestResponse({err: err}));
        }else{
           res.json(staking.docs)
        }
    })

})

router.get("/:id",(req, res, next) => {
 if(req.params.id) {

     Staking.findById(req.params.id)
     .then((nft) =>{
         res.json(nft)
     })
     .catch((err) =>{
         return res
        .status(500) 
        .send({ error: 'Internal Server error.' });
     })
 }else {  
  return res
        .status(400) 
        .send({ error: 'NFT id not provided.' });
 }
})

router.put("/:id",(req, res, next) => {
    
    if(!req.params.id) {
         next(new BadRequestResponse({message: 'Please provide valid id.'}));
    }

    const dataToUpdate = {};
    if(req.body.asset) {
        dataToUpdate.asset = req.body.asset;
    } 
    if(req.body.startDate) {
        dataToUpdate.startDate = req.body.startDate;
    } 
    if(req.body.endDate) {
        dataToUpdate.endDate = req.body.endDate;
    } 
    if(req.body.gems) {
        dataToUpdate.gems = req.body.gems;
    }
    
    
    Staking.findOneAndUpdate({ _id: req.params.id }, dataToUpdate )
    .then(success => {
       res.json(success);
    })
    .catch(error => {
         return res
        .status(500) 
        .send({ error: 'Internal Server Error' });
    })

})

router.post("/",(req, res, next) => {

try {
    console.log("body", req.body);
    const { asset, startDate, endDate, gems } = req.body;
    const stake = new Staking({asset, startDate, endDate, gems});
    stake.save()
    .then(success => {
       res.json(success)

    })
    .catch(err => {
        return res
        .status(400) 
        .send({ error: 'Please provide valid information.' });
    })

}
catch (e) {
 return res
        .status(500) 
        .send({ error: 'Internal Server Error' });
}

})
router.delete("/:id",(req, res, next) => {
    if(!req.params.id) {
         next(new BadRequestResponse({message: 'Please provide valid NFT id.'}));
    }
  Staking.findByIdAndRemove(req.params.id)
    .then((result) => {
          next(new OkResponse({message: 'NFT deleted successfully'}));
    })
    .catch((err) => {
        return res
        .status(500) 
        .send({ error: 'Internal Server Error' });
    })

})
 
 module.exports = router