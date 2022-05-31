const express = require('express'); 
const router = express.Router(); 

//importing routes 
const UserRoutes = require('./UserAuth');
const AdminRoutes = require('./AdminRoutes');
router.use('/user',UserRoutes); 
router.use('/admin',AdminRoutes); 

module.exports = router; 