const router = require('express').Router();


//importing product routes
const Product = require('./Product'); 
const Find = require('./Find'); 
const Buy = require('./Buy'); 

router.use('/',Product);
router.use('/find',Find);
router.use('/buy',Buy); 
module.exports = router ; 