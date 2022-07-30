const router = require('express').Router();


const FetchUser = require('../../middlewares/FetchUser');
// importing model 
const Product = require('../../models/Product');
const User = require('../../models/User');

// pagination middleware ; 
const Pagination = require('../../middlewares/Pagination');
const { default: mongoose } = require('mongoose');

router.get('/all', Pagination(Product), async (req, res) => {
    try {
        if (req.pagination) {
            return res.status(200).json({ success: true, pagination: req.pagination })
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, msg: 'Internal Server Error' });
    }
})
router.get('/category', Pagination(Product), async (req, res) => {
    try {
        if (req.pagination) {
            return res.status(200).json({ success: true, pagination: req.pagination })
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, msg: 'Internal Server Error' });
    }
})
router.get('/:id', async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ success: false, msg: "Invalid Object Id" })
        }
        let id = new mongoose.Types.ObjectId(req.params.id);
        let product = await Product.findById(id);
        if (!product) {
            return res.status(400).json({ success: false, msg: "Product Not Found" })
        }
        return res.status(200).json({ success: true, product: product })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, msg: 'Internal Server Error' });
    }
})
router.get('/personalised/:number',
    FetchUser,
    async (req, res) => {
        try {
            let number = parseInt(req.params.number);

            let user = await User.findById(req.user.id);
            let { interests } = user;

            let products = await Product.find();

            let personalised = products.filter((product) => {
                if (interests.includes(product.details.brand)) {
                    return product;
                }
            })
            if (personalised.length === 0) {
                personalised = products
            }
            personalised = personalised.slice(0, number);
            res.status(200).json({ success: true, products: personalised });
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ success: false, msg: 'Internal Server Error' });
        }
    })
module.exports = router; 