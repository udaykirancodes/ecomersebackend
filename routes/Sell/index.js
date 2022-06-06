const router = require('express').Router();


//importing product routes

const Sell = require('./Sell')


router.use('/',Sell); 

module.exports = router ; 