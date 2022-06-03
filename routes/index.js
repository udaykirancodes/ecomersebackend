const express = require('express'); 
const router = express.Router(); 

// importing routers 
const Auth = require('./auth/index');  
const Products = require('./Product/index'); 
const Blogs = require('./Blogs/index'); 
const Subscribers = require('./Subscribers/index'); 
const Emails = require('./Emails/index'); 

//authentication routes 
router.use('/auth',Auth); 

//product routes 
router.use('/product',Products);

// blog product routers 
router.use('/blogs',Blogs)

// subscriber routes 
router.use('/subscribers',Subscribers); 

// Email - Marketing Routes 
router.use('/emails',Emails);  

// base root 
router.get('/',(req,res)=>{
    res.send('Hello👋')
})

module.exports = router ; 