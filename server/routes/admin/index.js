let router = require('express').Router();

router.use('/users', require('./user'));
router.use('/nfts', require('./nft'));

module.exports = router;