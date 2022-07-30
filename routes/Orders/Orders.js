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

            let { products, location, price, phone } = req.body;
            // here products is array of objects having ObjectID,quantity 

            // create a order
            let order = new Order({
                userid: req.user.id,
                products: products,
                status: 'pending',
                phone: phone,
                price: price,
                location: location
            })

            let neworder = await order.save();

            res.status(200).json({ success: true, data: neworder });
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, msg: "Internal Server Error" });
        }
    })

// ordering cancelling :: user cancel route 
router.put('/cancel',
    FetchUser,
    async (req, res) => {
        try {

            // let status = req.params.status 

            let { orderid } = req.body;

            // find order exists 
            let order = await Order.findByIdAndUpdate(orderid);

            if (!order) {
                return res.status(400).json({ success: false, msg: "Order Not Found" });
            }

            order.status = 'cancelled';

            let neworder = await order.save();

            return res.status(200).json({ success: true, msg: "Order Cancelled" });

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

            let { orderid, status } = req.body;

            if (!req.body.status) {
                return res.status(400).json({ success: false, msg: "Status Required" })

            }

            // find order exists 
            let order = await Order.findByIdAndUpdate(orderid);

            if (!order) {
                return res.status(400).json({ success: false, msg: "Order Not Found" });
            }

            order.status = status;

            let neworder = await order.save();

            return res.status(200).json({ success: true, msg: "Order Confirmed" });

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
            // let UserOrders = await Order.find({ userid: id });
            let orders = await Order.aggregate([
                { $match: { products: { $exists: true } } },
                {
                    $lookup: {
                        from: "products",
                        let: { products: "$products" },
                        pipeline: [
                            { $match: { $expr: { $in: ["$_id", "$$products"] } } }
                        ],
                        as: "productObjects"
                    }
                }
            ])
            orders = orders.filter((ord) => ord.userid == req.user.id);
            res.status(200).json({ success: true, orders: orders });
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ success: false, msg: "Internal Server Error" });
        }
    })
router.get('/getall',
    async (req, res) => {
        try {
            // let orders = await Order.find();
            let orders = await Order.aggregate([
                { $match: { products: { $exists: true } } },
                {
                    $lookup: {
                        from: "products",
                        let: { products: "$products" },
                        pipeline: [
                            { $match: { $expr: { $in: ["$_id", "$$products"] } } }
                        ],
                        as: "productObjects"
                    }
                }
            ])
            res.status(200).json({ success: true, orders: orders });
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ success: false, msg: "Internal Server Error" });
        }
    })
module.exports = router; 