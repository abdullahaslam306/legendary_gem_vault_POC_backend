let router = require('express').Router();
let mongoose = require("mongoose");
let httpResponse = require('express-http-response');
let OkResponse = httpResponse.OkResponse;
let ForbiddenResponse = httpResponse.ForbiddenResponse;
let BadRequestResponse = httpResponse.BadRequestResponse;
let User = mongoose.model('User');
let recoverPersonalSignature = require('eth-sig-util').recoverPersonalSignature;
let bufferToHex = require('ethereumjs-util').bufferToHex;
let jwt = require('jsonwebtoken');


router.get('/', (req, res, next) => {
    if(req.query.walletAddress || typeof req.query.walletAddress != 'undefined'){
        User.findOne({walletAddress: req.query.walletAddress},(err, result) => {
            if(err){
                console.log(err);
            }else{
                next(new OkResponse({result: result}));
            }
        });
    }else{
        next(new OkResponse({result: null}));
    }
});

router.post('/', (req, res, next) => {
    const walletAddress = req.body.publicAddress;
    const signature = req.body.signature;
    const nonce = req.body.nonce;
    if (!signature || !walletAddress){
        return res
        .status(400)
        .send({ error: 'Request should have signature and publicAddress' });
    }

    const msg = `I am signing-up using my one-time nonce: ${nonce}`;

    // We now are in possession of msg, publicAddress and signature. We
    // will use a helper from eth-sig-util to extract the address from the signature
    const msgBufferHex = bufferToHex(Buffer.from(msg, 'utf8'));
    const address = recoverPersonalSignature({
        data: msgBufferHex,
        sig: signature,
    });

    // The signature verification is successful if the address found with
    // sigUtil.recoverPersonalSignature matches the initial publicAddress
    if (address.toLowerCase() == walletAddress.toLowerCase()) {
        let user = new User();
        user.walletAddress = req.body.publicAddress;
        user.save((err, result) => {
            if(!err){
                next(new OkResponse({result: result}));
            }
        })
    } else {
        res.status(401).send({
            error: 'Signature verification failed',
        });
        return null;
    }

});

router.post('/auth', (req, res, next) => {
    const walletAddress = req.body.walletAddress;
    const signature = req.body.signature;
    if (!signature || !walletAddress){
        return res
        .status(400)
        .send({ error: 'Request should have signature and publicAddress' });
    }


    User.findOne({walletAddress: walletAddress})
    .then(user => {
        if (!user) {
            res.status(401).send({
                error: `User with publicAddress ${publicAddress} is not found in database`,
            });
            return null;
        }
        return user;
    })
    .then(user => {
        if (!user) {
            // Should not happen, we should have already sent the response
            throw new Error(
                'User is not defined in "Verify digital signature".'
            );
        }
        const msg = `I am signing my one-time nonce: ${user.nonce}`;

        // We now are in possession of msg, publicAddress and signature. We
        // will use a helper from eth-sig-util to extract the address from the signature
        const msgBufferHex = bufferToHex(Buffer.from(msg, 'utf8'));
        const address = recoverPersonalSignature({
            data: msgBufferHex,
            sig: signature,
        });

        // The signature verification is successful if the address found with
        // sigUtil.recoverPersonalSignature matches the initial publicAddress
        if (address.toLowerCase() == walletAddress.toLowerCase()) {
            return user;
        } else {
            res.status(401).send({
                error: 'Signature verification failed',
            });
            return null;
        }
    })
    .then(user => {
        if (!user) {
            // Should not happen, we should have already sent the response
            throw new Error(
                'User is not defined in "Generate a new nonce for the user".'
            );
        }
        user.nonce = Math.floor(Math.random() * 10000);
        return user.save();
    })
    .then(user => {
        try{
            return new Promise((resolve, reject) =>
                jwt.sign(
                    {
                        payload: {
                            id: user._id,
                            walletAddress,
                        },
                    },
                    'shhhh', //Will put in .env
                    {
                        algorithm: 'HS256',
                    },
                    (err, token) => {
                        if (err) {
                            return reject(err);
                        }
                        if (!token) {
                            return new Error('Empty token');
                        }
                        return resolve(token);
                    }
                )
            );
        }catch(e){console.log(e)}
        
    })
    .then(async(accessToken) => {
        res.send({accessToken: accessToken});
    }).catch(next)

});


module.exports = router;