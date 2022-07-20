const router = require('express').Router();


//importing product routes
const Cart = require('./Cart');

router.use('/', Cart);

module.exports = router; 