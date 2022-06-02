const express = require('express'); 
const router = express.Router(); 

// importing routers 
const Auth = require('./auth/index');  
const Products = require('./Product/index'); 
const Blogs = require('./Blogs/index'); 
const Marketing = require('./Marketing/index'); 


//authentication routes 
router.use('/auth',Auth); 

//product routes 
router.use('/product',Products);

// blog product routers 
router.use('/blogs',Blogs)

// marketing routes 
router.use('/marketing',Marketing); 

// base root 
router.get('/',(req,res)=>{
    res.send('Hello👋')
})

module.exports = router ; 