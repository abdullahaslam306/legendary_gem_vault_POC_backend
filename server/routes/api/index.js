let router = require('express').Router();

router.use('/users', require('./users'));
router.use('/perk', require('./perk'));
router.use('/nft', require('./nft'));

module.exports = router;