let router = require('express').Router();

router.use('/users', require('./user'));
router.use('/nfts', require('./nft'));
router.use('/stakings', require('./stakings'));
router.use('/perks', require('./perks'));

module.exports = router;