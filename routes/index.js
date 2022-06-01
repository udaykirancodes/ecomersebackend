const express = require('express'); 
const router = express.Router(); 

// importing routers 
const Auth = require('./auth');  
const Products = require('./Product/AddProduct'); 

//authentication routes 
router.use('/auth',Auth); 

//product routes 
router.use('/product',Products);



module.exports = router ; 