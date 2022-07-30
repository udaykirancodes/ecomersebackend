const router = require('express').Router();


//importing product routes
const Enquiry = require('./Enquiry');

router.use('/', Enquiry);

module.exports = router; 