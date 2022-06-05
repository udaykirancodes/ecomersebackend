const router = require('express').Router(); 

// importing routes 
const WishList = require('./WishList');


router.use('/',WishList); 


module.exports = router; 