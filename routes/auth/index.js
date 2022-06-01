const express = require('express'); 
const router = express.Router(); 

//importing routes 
const UserRoutes = require('./UserAuth');
const AdminRoutes = require('./AdminRoutes');
const SellRoutes = require('./SellRoutes');
router.use('/user',UserRoutes); 
router.use('/admin',AdminRoutes); 
router.use('/getprice',SellRoutes); 

module.exports = router; 