let router = require('express').Router();
const { sendCouponEmail } = require('../../utilities/emailService');
let httpResponse = require('express-http-response');
let OkResponse = httpResponse.OkResponse;


router.get('/email',(req, res, next) => {
    if(req.query.address || typeof req.query.address != 'undefined'){
       sendCouponEmail(req.query.address,'Test user', 'FAKE' ).then(() =>{
        next(new OkResponse({message: 'Successfully sent!'}));
       })
    }else{
        next(new OkResponse({message: 'Receiver email address not provided'}));
    }
});
 module.exports = router;