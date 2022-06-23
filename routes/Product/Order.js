const router = require('express').Router();
const mongoose = require('mongoose')

// importing middlewares 
const FetchUser = require('../../middlewares/FetchUser');

// importing Models 
const Order = require('../../models/Order');
const User = require('../../models/User');
const Product = require('../../models/Product');

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

            // find if user exists 
            let user = await User.findById(userid);
            if (user) {
                return res.status(400).json({ success: false, msg: "User Doesn't exists" })
            }

            // find if product exists
            let product = await Product.findById(productid);
            if (!product) {
                return res.status(400).json({ success: false, msg: "Product Doesn't exists" })
            }

            // find if exists 
            let order = await Order.findOne({ userid: userid });

            if (order) {
                if (!order.list.includes(productid)) {
                    await order.updateOne({ $push: { list: productid } });
                    return res.status(200).json({ success: true, msg: "Item Added to order Section" })
                }
                else {
                    return res.status(400).json({ success: false, msg: "Item already added to order section" })
                }
            }
            else {
                order = new Order({
                    userid: userid,
                    list: [productid]
                })
                let neworder = await order.save();
                res.status(200).json({ success: true, neworder });
            }

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
            let { userid, productid } = req.body;

            // validate 
            if (!mongoose.isValidObjectId(userid) || !mongoose.isValidObjectId(productid)) {
                return res.status(400).json({ success: false, msg: "Invalid Id" })
            }

            // find if user exists 
            let user = await User.findById(userid);
            if (user.length == 0) {
                return res.status(400).json({ success: false, msg: "User Doesn't exists" })
            }

            // find if product exists
            let product = await Product.findById(productid);
            if (!product) {
                return res.status(400).json({ success: false, msg: "Product Doesn't exists" })
            }

            // delete here 
            // find if exists 
            let order = await Order.findOne({ userid: userid });

            if (!order) {
                return res.status(400).json({ success: false, msg: "Your List is Empty" });
            }

            if (order.list.includes(productid)) {
                await order.updateOne({ $pull: { list: productid } });
                return res.status(200).json({ success: true, msg: "Item Removed from order Section" })
            }
            else {
                return res.status(400).json({ success: false, msg: "Item Not in  order section" })
            }

        } catch (error) {
            console.log(error.message);
            res.status(500).json({ success: false, msg: "Internal Server Error" });
        }
    })
router.get('/get',
    FetchUser,
    async (req, res) => {
        try {
            let id = new mongoose.Types.ObjectId(req.user.id);
            let UserOrders = await Order.find({ userid: id });
            res.status(200).json({ success: false, data: UserOrders });
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ success: false, msg: "Internal Server Error" });
        }
    })
module.exports = router; 