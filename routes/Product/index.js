const router = require('express').Router();


//importing product routes
const Product = require('./Product'); 
const Find = require('./Find'); 

router.use('/',Product);
router.use('/find',Find);
module.exports = router ; 