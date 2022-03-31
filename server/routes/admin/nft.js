let router = require('express').Router();
let mongoose = require("mongoose");
let NFT = mongoose.model('NFT');
let httpResponse = require('express-http-response');
let OkResponse = httpResponse.OkResponse;
let ForbiddenResponse = httpResponse.ForbiddenResponse;
let BadRequestResponse = httpResponse.BadRequestResponse;


router.get("/",(req, res, next) => {

 const options = {
        page: +req.query.page || 1,
        limit: +req.query.limit || 10,
    }

    NFT.paginate({}, options, (err, result) => {
        if(err) {
            next(new BadRequestResponse({err: err}));
        }else{
           res.json(result.docs)
        }
    })

})

router.get("/:id",(req, res, next) => {
 if(req.params.id) {

     NFT.findById(req.params.id)
     .then((nft) =>{
         res.json(nft)
     })
     .catch((err) =>{
         console.log('here')
     })
 }else {  
  return res
        .status(400) 
        .send({ error: 'NFT id not provided.' });
 }
})

router.put("/:id",(req, res, next) => {
    
    if(!req.params.id) {
         next(new BadRequestResponse({message: 'Please provide valid NFT id.'}));
    }

    const dataToUpdate = {};
    if(req.body.address) {
        dataToUpdate.address = req.body.address;
    } 
    if(req.body.tokenId) {
        dataToUpdate.tokenId = req.body.tokenId;
    } 
    if(req.body.tokenUri) {
        dataToUpdate.tokenUri = req.body.tokenUri;
    } 
    if(req.body.noOfGems) {
        dataToUpdate.noOfGems = req.body.noOfGems;
    }
    
    
    NFT.findOneAndUpdate({ _id: req.params.id }, dataToUpdate )
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
    const { address, tokenId, tokenUri, noOfGems} = req.body;
    const nft = new NFT({address, tokenId, tokenUri, noOfGems});
    nft.save()
    .then(success => {
        console.log('created')
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
  NFT.findByIdAndRemove(req.params.id)
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