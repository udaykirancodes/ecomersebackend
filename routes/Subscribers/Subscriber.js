const router = require('express').Router(); 
const mongoose = require('mongoose'); // importing models 
const User = require('../../models/User');

const FetchAdmin = require('../../middlewares/FetchAdmin'); 
const Pagination = require('../../middlewares/Pagination');

// subscribe a user to the marketing  
router.post('/subscribe/:id' , async (req,res)=>{
    try {
        let id = req.params.id
        if(mongoose.isValidObjectId(id)){
            return res.status(400).json({success:false , msg:"Invalid Id"});
        }
        //convert string into mongo object id 
        id = new mongoose.Types.ObjectId(id);
    
        // finding if user exists 
        let user = await User.findByIdAndUpdate(id); 
        if(!user){
            return res.status(400).json({success:false,msg:"User Doesn't Exists"}); 
        }
        
        // checking if aleready subscribed 
        if(user.subscribed===true){
            await user.save(); 
            return res.status(400).json({success:false,msg:"User Already Subscribed"}); 
        }

        user.subscribed = true;         

        let newuser = await user.save(); 
        res.status(200).json({success:true , msg:"User Subscribed"}); 
    } catch (error) {
        console.log(error.message);
        res.status(500).json({success:false,msg:'Internal Server Error'});
    }
})


// unsubscribe a user 
router.delete('/unsubscribe/:id' , async (req,res)=>{
    try {
        let id = req.params.id
        if( mongoose.isValidObjectId(id)){
            return res.status(400).json({success:false , msg:"Invalid Id"});
        }
        //convert string into mongo object id 
        id = new mongoose.Types.ObjectId(id);
        // findng if user exists 
        let user = await User.findByIdAndUpdate(id); 
        if(!user){
            return res.status(400).json({success:false,msg:"User Not Exists"}); 
        }

        // checking if subscribed or not 
        if(!user.subscribed){
            await user.save(); 
            return res.status(400).json({success:false,msg:"User haven't Subscribed"}); 
        }
        user.subscribed = false; 
        let newuser = await user.save(); 
        res.status(200).json({success:true , msg:"User UnSubscribed"}); 
    } catch (error) {
        console.log(error.message);
        res.status(500).json({success:false,msg:'Internal Server Error'});
    }
})
router.get('/getall', FetchAdmin , Pagination(User) , async (req , res)=> {
    try {
        if(req.pagination){
            res.status(200).json({success:true,subscribers:req.pagination}); 
        }
    } catch (error) {
        res.status(500).json({success:false,msg:'Internal Server Error'});
    }
} )
module.exports = router ; 