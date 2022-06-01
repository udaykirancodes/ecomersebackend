const express = require('express'); 
const router = express.Router(); 

// importing routers 
const Auth = require('./auth');  
const Products = require('./Product/index'); 

const Sell = require('./Sell')

router.get('/',(req,res)=>{
    res.send("Hey! I'm Uday."); 
}); 


//authentication routes 
router.use('/auth',Auth); 

//product routes 
router.use('/product',Products);
router.use('/sell',Sell);


router.get('/',(req,res)=>{
    res.send('Hello👋')
})

module.exports = router ; 