const router = require('express').Router();


//importing product routes
const SellRoutes = require('./SellRoutes');

router.use('/',SellRoutes);

module.exports = router ; 