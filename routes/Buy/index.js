const router = require('express').Router(); 

// importing routes 
const Buy = require('./Buy'); 


router.use('/',Buy); 

module.exports = router 