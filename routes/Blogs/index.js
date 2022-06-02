const router = require('express').Router();

//import blogs route 
const Blogs = require('./Blogs'); 

router.use('/',Blogs);

module.exports = router; 