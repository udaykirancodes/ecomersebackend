const router = require('express').Router();

const Emails = require('./Emails'); 

router.use('/',Emails); 

module.exports = router;