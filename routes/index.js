const express = require('express'); 
const router = express.Router(); 

// importing routers 
const Auth = require('./auth');  
const Products = require('./Product/index'); 

//authentication routes 
router.use('/auth',Auth); 

//product routes 
router.use('/product',Products);

router.get('/',(req,res)=>{
    res.send('Hello👋')
})

module.exports = router ; 