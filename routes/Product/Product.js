const router = require('express').Router(); 
const { body, validationResult } = require('express-validator');

const multer  = require('multer')

// importing model 
const Product = require('../../models/Product'); 
const Categories = require('../../models/Categories'); 

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

// get categories of blgos 
router.get('/categories',async (req,res)=>{
    try {
        let all = await Categories.findOne().select("products"); 
        let {products} = all 
        res.status(200).json({success:true,data:products}); 
    } catch (error) {
        return res.status(500).json({success:false,msg:"Internal Server Error"}); 
    }
})

// add product route , AdminAccess 
router.post('/add',
[
    body('name', 'Name Should be atleast 3 characters').isLength({min:3}),
    body('price', 'Price Should not be empty').isNumeric()
],
FetchAdmin ,
upload.array('images', 5),
async(req,res)=>{
    const errors = validationResult(req);

    // if (!errors.isEmpty()) {
    //     return res.status(401).json({ success:false , msg: "All Fields are Required"})
    // }
    try {
        if(!req.body.category){
            return res.status(400).json({success:false,msg:"Category Required"}); 
        }

        // add categories to the categories section
        let allCategories = await Categories.findOne(); 

        // first time create model if there is no data 
        if(!allCategories){
            console.log('categories not found')
            let a = new Categories({
                products : req.body.subCategory
            })
            await a.save(); 
        }
        // if we have the data then add new categories 
        else{
            let {subCategory} = req.body;
            console.log(subCategory); 
            let newCategories = []; 

            if(subCategory.length){
                subCategory.forEach(element => {
                    if(!allCategories.products.includes(element)){
                        newCategories.push(element); 
                    }
                });
            }
            console.log(newCategories); 
            
            await Categories.updateOne( { $addToSet: { products : { $each: newCategories } } });
            // await Categories.updateOne({$pushAll: {blogs:['google','fb']}},{upsert:true});
             return res.send('ey')
         }
        if(req.body.category === "automobile"){
            let product = new Product({
                name:req.body.name , 
                category:req.body.category,
                description:req.body.description,
                subCategory:req.body.subCategory, 
                details:{
                    brand:req.body.brand,
                    modelname:req.body.modelname,
                    fuelType:req.body.fuelType 
                },
                price:req.body.price,
                img:req.files.map(element => {
                    return element.path 
                })
            })
            let newProduct = await product.save(); 
            return res.status(200).json({success:true,data:newProduct}); 
        }
        if(req.body.category === "metal"){
            let product = new Product({
                name:req.body.name , 
                category:req.body.category,
                description:req.body.description,
                subCategory:req.body.subCategory, 
                details:{
                    brand:req.body.brand || '',
                    modelname:req.body.modelname || '',
                    metalType:req.body.metalType || '' ,     
                },
                price:req.body.price,
                img:req.files.map(element => {
                    return element.path 
                })
            })
        
            let newProduct = await product.save(); 
            return res.status(200).json({success:true,data:newProduct}); 
        }
    
    } catch (error) {
        console.log(error.message);
        res.status(500).json({success:false,msg:'Internal Server Error'});
    }

})


// Delete Product :: AdminAccess 
router.put('/delete'
,FetchAdmin ,
async(req,res)=>{
    try {
    
        let product = await Product.findByIdAndUpdate(req.body.id); 

        if(!product){
            return res.status(400).json({success:false,msg:"Product is Not Available"})
        }

        product.isDeleted = true 

        await product.save(); 
        
        res.status(200).json({success:true,data:"product is deleted"}); 
    
    } catch (error) {
        console.log(error.message);
        res.status(500).json({success:false,msg:'Internal Server Error'});
    }

})
// Undo Delete A ß Product :: AdminAccess 
router.put('/undo'
,FetchAdmin ,
async(req,res)=>{
    try {
    
        let product = await Product.findByIdAndUpdate(req.body.id); 

        if(!product){
            return res.status(400).json({success:false,msg:"Product is Not Available"})
        }
        if(!product.isDeleted){
            return res.status(400).json({success:false , msg:"Product is Not in Deleted List"})
        }
        product.isDeleted = false ;  
        await product.save(); 
        res.status(200).json({success:true,data:"product is retrived back"}); 
    
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
    // if (!errors.isEmpty()) {
    //     return res.status(401).json({ success:false , msg: "All Fields are Required" })
    // }
    try {

        let product = await Product.findByIdAndUpdate(req.body.id); 

        if(!product){
            return res.status(400).json({success:false,msg:"Product is Not Available"})
        }
        if(!req.body.category){
            return res.status(400).json({success:false,msg:"Category Required"}); 
        }
        if(req.body.category === "automobile"){
            product.name=req.body.name || product.name 
            product.category=req.body.category || product.category
            product.description=req.body.description ? req.body.description : product.description
            product.subCategory=req.body.subCategory || product.subCategory 
            product.details={
                brand:req.body.brand ? req.body.brand : product.details.brand,
                modelname:req.body.modelname ? req.body.modelname : product.details.modelname,
                fuelType:req.body.fuelType ? req.body.fuelType : product.details.fuelType
            },
            product.price=req.body.price || product.price

            if(req.files){
                product.img = req.files.map(element => {
                    return element.path 
                })
            }
            let newProduct = await product.save(); 
            return res.status(200).json({success:true,product:newProduct}); 
        }
        if(req.body.category === "metal"){
            product.name=req.body.name || product.name
            product.category=req.body.category || product.category
            product.description=req.body.description || product.description
            product.subCategory=req.body.subCategory || product.subCategory 
            product.details={
                brand:req.body.brand ? req.body.brand : product.details.brand,
                modelname:req.body.modelname ? req.body.modelname : product.details.modelname,
                metalType:req.body.metalType ? req.body.metalType : product.details.metalType,     
            }
            product.price=req.body.price || product.price

            if(req.files){
                product.img = req.files.map(element => {
                    return element.path 
                })
            }
            let newProduct = await product.save(); 
            res.status(200).json({success:true,product:newProduct}); 
        }
    
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,msg:'Internal Server Error'});
    }
})

module.exports = router ; 