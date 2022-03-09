let router = require('express').Router();

router.use('/users', require('./users'));
router.use('/perk', require('./perk'));

module.exports = router;