const express = require('express'); 
const router = express.Router(); 

// importing routers 
const Auth = require('./auth'); 

const Sell = require('./Sell')

router.get('/',(req,res)=>{
    res.send("Hey! I'm Uday."); 
}); 


//authentication routes 
router.use('/auth',Auth); 

router.use('/sell',Sell);



module.exports = router ; 