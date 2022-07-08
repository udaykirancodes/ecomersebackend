const router = require('express').Router();


//importing product routes
const Feedback = require('./Feedback'); 

router.use('/',Feedback);

module.exports = router ; 