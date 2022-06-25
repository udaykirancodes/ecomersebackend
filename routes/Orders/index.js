const router = require('express').Router();


//importing product routes
const Orders = require('./Orders'); 

router.use('/',Orders);

module.exports = router ; 