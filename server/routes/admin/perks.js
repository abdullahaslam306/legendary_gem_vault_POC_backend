let router = require('express').Router();
let mongoose = require("mongoose");
let Perk = mongoose.model('Perk');
let httpResponse = require('express-http-response');

let BadRequestResponse = httpResponse.BadRequestResponse;


router.post('/', (req, res, next) => {  //There will be an auth middleware to check authenticated user
    let perk = new Perk();
    perk.description = req.body.description;
    perk.image = req.body.image;
    perk.price = req.body.price;
    perk.quantity = req.body.quantity;

    perk.save().then(() => {
               res.json(perk)
    });
});

router.get('/', (req, res, next) => {
    try{
        const options = {
            page: +req.query.page || 1,
            limit: +req.query.limit || 12,
        }
 
        Perk.paginate({}, options, (err, result) => {
            if(err) {
                next(new BadRequestResponse({err: err}));
            }else{
                      res.json(result.docs)
            }
        });
    }catch(err) {console.log(err);}
});


router.get("/:id",(req, res, next) => {
 if(req.params.id) {

     Perk.findById(req.params.id)
     .then((perk) =>{
         res.json(perk)
     })
     .catch((err) =>{
         console.log(err)
     })
 }else {  
  return res
        .status(400) 
        .send({ error: 'Perk id not provided.' });
 }
})

router.put("/:id",(req, res, next) => {
    
    if(!req.params.id) {
         next(new BadRequestResponse({message: 'Please provide valid perk id.'}));
    }

    const dataToUpdate = {};
    if(req.body.description) {
        dataToUpdate.description = req.body.description;
    } 
    if(req.body.image) {
        dataToUpdate.image = req.body.image;
    } 
    if(req.body.price) {
        dataToUpdate.price = req.body.price;
    } 
    if(req.body.quantity) {
        dataToUpdate.quantity = req.body.quantity;
    }
    
    
    Perk.findOneAndUpdate({ _id: req.params.id }, dataToUpdate )
    .then(success => {
       res.json(success);
    })
    .catch(error => {
         return res
        .status(500) 
        .send({ error: 'Internal Server Error' });
    })

})

module.exports = router;