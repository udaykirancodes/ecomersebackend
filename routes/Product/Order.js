const router = require('express').Router();
const mongoose = require('mongoose')

// importing middlewares 
const FetchUser = require('../../middlewares/FetchUser');

// importing Models 
const User = require('../../models/User');
const Product = require('../../models/Product');
const FetchAdmin = require('../../middlewares/FetchAdmin');

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

            // updating 
            await user.updateOne({ 
                $push: {
                     orders: {
                        productid : productid,
                        status : 'Pending',
                        price : product.type==='automobile' ? product.price : null  
                     }
                    }})
            
            res.status(200).json({ success: true, msg : "Product Ordered "});
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

            let { userid, productid  } = req.body;

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
            // remove that obj 
            let updated = await user.updateOne({ 
                $pull: {
                     orders: {
                        productid : productid,
                     }
                }})
            if(!updated){
                return res.status(400).json({success:false,msg:'Order Not Found'})
            }
            
            // add new Object 
            let done = await user.updateOne({ 
                $push: {
                     orders: {
                        productid : productid,
                        status:'Cancelled',
                        price : product.category === 'automobile' ? product.price : null 
                     }
                    }})
            if(!done){
                return res.status(400).json({success:false,msg:'Order Not Found'})
            }   
            // order.status = 'deleted'; 
            // let deleted = await order.save(); 

            return res.status(200).json({success:true , msg : "Order Cancelled"}); 

        } catch (error) {
            console.log(error.message);
            res.status(500).json({ success: false, msg: "Internal Server Error" });
        }
    })
// ordering cancelling 
router.put('/accept',
    FetchAdmin,
    async (req, res) => {

        try {

            // let status = req.params.status 

            let { userid, productid , price , status} = req.body;

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
            // remove that obj 
            let updated = await user.updateOne({ 
                $pull: {
                     orders: {
                        productid : productid,
                        status : "Pending" || "Cancelled"
                     }
                }})
            if(!updated){
                return res.status(400).json({success:false,msg:'Order Not Found'})
            }
            
            // add new Object 
            let done = await user.updateOne({ 
                $push: {
                     orders: {
                        productid : productid,
                        status:status,
                        price : product.category==='automobile'?product.price : price 
                     }
                    }})
            if(!done){
                return res.status(400).json({success:false,msg:'Order Not Found'})
            }   
            // order.status = 'deleted'; 
            // let deleted = await order.save(); 

            return res.status(200).json({success:true , msg : "Order Price Coated"}); 

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
    FetchAdmin,
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



//like / dislike a post

// router.put("/:id/like", async (req, res) => {
//     try {
//       const post = await Post.findById(req.params.id);
//       if (!post.likes.includes(req.body.userId)) {
//         await post.updateOne({ $push: { likes: req.body.userId } });
//         res.status(200).json("The post has been liked");
//       } else {
//         await post.updateOne({ $pull: { likes: req.body.userId } });
//         res.status(200).json("The post has been disliked");
//       }
//     } catch (err) {
//       res.status(500).json(err);
//     }
//   });