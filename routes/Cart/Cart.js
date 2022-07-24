const router = require("express").Router();
const { body, validationResult } = require("express-validator");
const mongoose = require("mongoose");

// importing middlewares
const FetchUser = require("../../middlewares/FetchUser");

// importing models
const User = require("../../models/User");
const Product = require("../../models/Product");

// route :: add item to cart
router.post("/add", FetchUser, async (req, res) => {
    // find if cart is already created for the user
    try {
        if (!mongoose.isValidObjectId(req.body.productid)) {
            return res
                .status(400)
                .json({ success: false, msg: "Invaid Product Object id " });
        }
        let productid = new mongoose.Types.ObjectId(req.body.productid);

        // finding if user exists or not
        let user = await User.findById(req.user.id);

        // finding if product is exists or not
        let product = await Product.findById(productid);

        if (!product) {
            return res.status(400).json({ success: false, msg: "Product Not found" });
        }
        if (user && product) {
            // update if exists
            if (!user.cart.includes(req.body.productid)) {
                await user.updateOne({ $push: { cart: product._id } });
                await user.updateOne({ $push: { interests: product.category } }); // this is for personalisation of the data
                return res
                    .status(200)
                    .json({ success: true, data: "Product Added to cart" });
            } else {
                return res
                    .status(400)
                    .json({ success: false, msg: "Product Already Exists" });
            }
        }
        return res
            .status(400)
            .json({ success: false, msg: "something went wrong" });
    } catch (error) {
        console.log(error.message);
        res.status(200).json({ success: false, msg: "Internal Server Error" });
    }
});

// route :: delete item from cart
router.delete("/delete", FetchUser, async (req, res) => {
    // find if cart is already created for the user
    try {
        if (!mongoose.isValidObjectId(req.body.productid)) {
            return res
                .status(400)
                .json({ success: false, msg: "Invaid Product Object id " });
        }
        let productid = new mongoose.Types.ObjectId(req.body.productid);

        // finding if user exists or not
        let user = await User.findById(req.user.id);

        // finding if product is exists or not
        let product = await Product.findById(productid);

        if (!product) {
            return res.status(400).json({ success: false, msg: "Product Not found" });
        }
        if (user && product) {
            // update if exists
            if (user.cart.includes(req.body.productid)) {
                await user.updateOne({ $pull: { cart: product._id } });
                await user.updateOne({ $pull: { interests: product.category } }); // this is for personalisation of the data
                return res
                    .status(200)
                    .json({ success: true, data: "Product Removed from cart" });
            } else {
                return res
                    .status(200)
                    .json({ success: false, data: "Product Not in cart" });
            }
        }
        res.status(200).json({ success: true, data: "Something Went Wrong" });
    } catch (error) {
        console.log(error.message);
        res.status(200).json({ success: false, msg: "Internal Server Error" });
    }
});

// route :: getall item from cart
router.get("/getall", FetchUser, async (req, res) => {
    try {

        let user = await User.findById(req.user.id);

        if (!user) {
            return res.status(400).json({ success: false, msg: "User Not Found" })
        }

        let products = await Product.find();

        // filtering 

        let list = products.filter((product) => {
            if (user.cart.includes(product._id)) {
                return product
            }
        })

        return res.status(200).json({ success: true, products: list });

    } catch (error) {

        console.log(error.message);
        res.status(200).json({ success: false, msg: "Internal Server Error" });
    }
});

module.exports = router;
