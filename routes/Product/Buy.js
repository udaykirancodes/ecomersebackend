const router = require('express').Router(); 
const mongoose = require('mongoose')

// importing middlewares 
const FetchUser = require('../../middlewares/FetchUser'); 

// importing Models 
const Buy = require('../../models/Buy'); 
const User = require('../../models/User'); 
const Product = require('../../models/Product'); 

// Route :: Buy Product :: User Protected Route 
router.post('/',
FetchUser, 
async (req,res) => {
    try {
        
    
        let {userid , productid} = req.body; 

        // validate 
        if(!mongoose.isValidObjectId(userid) || !mongoose.isValidObjectId(productid)){
            return res.status(400).json({success:false,msg:"Invalid Id"})
        }

        // find if user exists 
        let user = await User.findById(userid); 
        if(user.length == 0){
            return res.status(400).json({success:false,msg:"User Doesn't exists"})
        }
       
        // find if product exists
        let product = await Product.findById(productid); 
        if(!product){
            return res.status(400).json({success:false,msg:"Product Doesn't exists"})
        }

        // find if exists 
        let buy = await Buy.findOne({userid : userid}); 

        if(buy){
            if(!buy.list.includes(productid)){
                await buy.updateOne({$push : { list : productid }});
                return res.status(200).json({success:true,msg:"Item Added to Buy Section"})
            }
            else{
                return res.status(400).json({success:false,msg:"Item already added to buy section"})
            }
        }
        else{
            buy = new Buy({
                userid : userid,
                list : [productid]
            })
            let newbuy = await buy.save(); 
            res.status(200).json({success:true,newbuy}); 
        }

    } catch (error) {
        console.log(error.message); 
        res.status(500).json({success:false,msg:"Internal Server Error"}); 
    }
})


router.get('/get',
FetchUser , 
async (req,res)=>{
    try {
        let id = new mongoose.Types.ObjectId(req.user.id);
        let UserBuyings  = await Buy.find({userid:id}); 
        res.status(200).json({success:false,data:UserBuyings}); 
    } catch (error) {
        console.log(error.message); 
        res.status(500).json({success:false,msg:"Internal Server Error"}); 
    }
})
module.exports = router ; 