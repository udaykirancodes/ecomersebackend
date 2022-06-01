const router = require('express').Router();


//importing product routes
const AddProduct = require('./AddProduct');

router.use('/',AddProduct);

module.exports = router ; 