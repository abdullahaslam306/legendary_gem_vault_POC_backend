var router = require('express').Router();
const {createAdminCRUD} = require('./admin'); 


router.use('/api', require('./api'));
router.use('/api/v1',     createAdminCRUD);

module.exports = router;