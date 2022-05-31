const express = require('express'); 
const router = express.Router(); 

// importing routers 
const Auth = require('./auth'); 

router.get('/',(req,res)=>{
    res.send("Hey! I'm Uday."); 
}); 


//authentication routes 
router.use('/auth',Auth); 



module.exports = router ; 