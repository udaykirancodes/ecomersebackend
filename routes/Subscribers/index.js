const router = require('express').Router(); 
const Subscriber = require('./Subscriber'); 

router.use('/',Subscriber); 

module.exports = router 