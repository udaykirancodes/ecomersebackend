const router = require('express').Router(); 

// importing routes 
const Filter = require('./Filter');


router.use('/',Filter); 


module.exports = router; 