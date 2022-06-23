const router = require('express').Router();


//importing product routes
const Product = require('./Product'); 
const Find = require('./Find'); 
const Order = require('./Order'); 

router.use('/',Product);
router.use('/find',Find);
router.use('/buy',Order); 
module.exports = router ; 