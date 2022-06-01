const router = require('express').Router(); 
const { body, validationResult } = require('express-validator');

const multer  = require('multer')

// importing model 
const Product = require('../../models/Product'); 

//importing middleware for admin checking 
const FetchAdmin = require('../../middlewares/FetchAdmin');  



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/products/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now().toString()+ '_'+file.originalname)
    }
})

const upload = multer({ storage : storage })


router.post('/add',
[
    body('name', 'Name Should be atleast 5 characters').isLength({min:5}),
    body('price', 'Price Should not be empty').isNumeric()
],
FetchAdmin 
,
upload.array('images', 5),
async(req,res)=>{
    try {
        let product = new Product({
            name:req.body.name , 
            category:req.body.category,
            details:{
                brand:req.body.brand,
                modelname:req.body.modelname,
                type:req.body.type
            },
            price:req.body.price,
            img:req.files.map(element => {
                return element.filename
            })
        })

        let newProduct = await product.save(); 

        res.status(200).json({success:true,data:newProduct}); 
    
    } catch (error) {
        console.log(error.message);
        res.status(500).json({success:false,msg:'Internal Server Error'});
    }

})

module.exports = router ; 