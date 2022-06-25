const router = require('express').Router();
const mongoose = require('mongoose')

// importing middlewares 
const FetchUser = require('../../middlewares/FetchUser');

// importing Models 
const User = require('../../models/User');
const Product = require('../../models/Product');
const FetchAdmin = require('../../middlewares/FetchAdmin');
const Order = require('../../models/Order'); 

// Route :: order Product :: User Protected Route 
router.post('/',
    FetchUser,
    async (req, res) => {
        try {

            let { userid, productid } = req.body;

            // validate 
            if (!mongoose.isValidObjectId(userid) || !mongoose.isValidObjectId(productid)) {
                return res.status(400).json({ success: false, msg: "Invalid Id" })
            }
            
            // find if product exists
            let product = await Product.findById(productid);
            if (!product) {
                return res.status(400).json({ success: false, msg: "Product Doesn't exists" })
            }
            
            // find if user exists 
            let user = await User.findById(userid);
            if (!user) {
                return res.status(400).json({ success: false, msg: "User Doesn't exists" })
            }

            let price = product.category === 'automobile' ? product.price : null ; 

            // create a order
            let order = new Order({
                userid: userid , 
                productid: productid , 
                status : 'pending',
                name : user.name , 
                productname : product.name,
                email : user.email,
                phone : user.phone ? user.phone : req.body.phone ,
                price : price 
            }) 

            let neworder = await order.save(); 
            
            res.status(200).json({ success: true, data : neworder});
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, msg: "Internal Server Error" });
        }
    })

// ordering cancelling 
router.put('/cancel',
    FetchUser,
    async (req, res) => {
        try {

            // let status = req.params.status 

            let { userid, productid , orderid } = req.body;

            // validate 
            if (!mongoose.isValidObjectId(userid) || !mongoose.isValidObjectId(productid)) {
                return res.status(400).json({ success: false, msg: "Invalid Id" })
            }

            // find if product exists
            let product = await Product.findById(productid);
            if (!product) {
                return res.status(400).json({ success: false, msg: "Product Doesn't exists" })
            }

            // find if user exists 
            let user = await User.findById(userid);
            if (!user) {
                return res.status(400).json({ success: false, msg: "User Doesn't exists" })
            }
            
            // find order exists 

            let order = await Order.findByIdAndUpdate(orderid); 

            if(!order){
                return res.status(400).json({success:false,msg:"Order Not Found"});
            }

            order.status = 'cancelled'; 

            let neworder = await Order.save(); 

            return res.status(200).json({success:true , msg : "Order Cancelled"}); 

        } catch (error) {
            console.log(error.message);
            res.status(500).json({ success: false, msg: "Internal Server Error" });
        }
    })
// ordering status  
router.put('/update',
    FetchAdmin,
    async (req, res) => {
        try {

            // let status = req.params.status 

            let { orderid , price , status } = req.body;

            if(!req.body.status){
                return res.status(400).json({ success: false, msg: "Status Required" })
                
            }

            // find order exists 
            let order = await Order.findByIdAndUpdate(orderid); 

            if(!order){
                return res.status(400).json({success:false,msg:"Order Not Found"});
            }

            order.status = status; 
            
            if(price){
                order.price = price 
            }

            let neworder = await order.save(); 

            return res.status(200).json({success:true , msg : "Order Confirmed"}); 

        } catch (error) {
            console.log(error.message);
            res.status(500).json({ success: false, msg: "Internal Server Error" });
        }
    })
router.get('/getuser',
    FetchUser,
    async (req, res) => {
        try {
            let id = new mongoose.Types.ObjectId(req.user.id);
            let UserOrders = await Order.find({ userid: id });
            res.status(200).json({ success: true, orders: UserOrders });
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ success: false, msg: "Internal Server Error" });
        }
    })
router.get('/getall',
    async (req, res) => {
        try {
            let orders = await Order.find(); 
            res.status(200).json({ success: true, orders: orders });
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ success: false, msg: "Internal Server Error" });
        }
    })
module.exports = router; 