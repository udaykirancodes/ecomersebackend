const router = require('express').Router(); 


// importing model 
const Product = require('../../models/Product'); 

router.get('/all',async (req,res)=>{
    try {
        let products = await Product.find();
        res.status(200).json({success:true,products:products}); 
    } catch (error) {
        console.log(error.message);
        res.status(500).json({success:false,msg:'Internal Server Error'});
    }
} )
module.exports = router ; 