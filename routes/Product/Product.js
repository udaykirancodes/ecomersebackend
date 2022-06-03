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


// add product route , AdminAccess 
router.post('/add',
[
    body('name', 'Name Should be atleast 5 characters').isLength({min:5}),
    body('price', 'Price Should not be empty').isNumeric()
],
FetchAdmin ,
upload.array('images', 5),
async(req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(401).json({ success:false , msg: "All Fields are Required" })
    }
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
                return element.path 
            })
        })
        console.log(req.files[0].path); 
        let newProduct = await product.save(); 

        res.status(200).json({success:true,data:newProduct}); 
    
    } catch (error) {
        console.log(error.message);
        res.status(500).json({success:false,msg:'Internal Server Error'});
    }

})


// Delete Product :: AdminAccess 
router.delete('/delete'
,FetchAdmin ,
async(req,res)=>{
    try {
    
        let product = await Product.findByIdAndDelete(req.body.id); 

        if(!product){
            return res.status(400).json({success:false,msg:"Product is Not Available"})
        }
        res.status(200).json({success:true,data:"product is deleted"}); 
    
    } catch (error) {
        console.log(error.message);
        res.status(500).json({success:false,msg:'Internal Server Error'});
    }

})

// Edit Product :: Admin Access 
router.put('/edit',
[
    body('name', 'Name Should be atleast 5 characters').isLength({min:5}),
    body('price', 'Price Should not be empty').isNumeric()
],
FetchAdmin ,
upload.array('images', 5),
async(req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(401).json({ success:false , msg: "All Fields are Required" })
    }
    try {

        let product = await Product.findByIdAndUpdate(req.body.id); 

        if(!product){
            return res.status(400).json({success:false,msg:"Product is Not Available"})
        }
        const {name ,category , price , brand , modelname , type } = req.body ; 
        if(name){
            product.name = name;
        }
        if(category){
            product.category =category
        }
        if(price){
            product.price = price
        }
        if(req.files[0]){
            product.img = req.files.map(element => {
                return element.path 
            })
        }
        if(brand){
            product.details.brand = brand;
        }
        if(modelname){
            product.details.modelname =modelname 
        }
        if(type){
            product.details.type = type 
        }

        let newProduct = await product.save(); 

        res.status(200).json({success:true,data:newProduct}); 
    
    } catch (error) {
        console.log(error.message);
        res.status(500).json({success:false,msg:'Internal Server Error'});
    }

})

module.exports = router ; 