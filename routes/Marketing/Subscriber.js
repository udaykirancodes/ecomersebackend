const router = require('express').Router(); 
const mongoose = require('mongoose')
; // importing models 
const Subscriber = require('../../models/Subscriber'); 
const User = require('../../models/User');


// subscribe a user to the marketing  
router.post('/subscribe/:id' , async (req,res)=>{
    try {
        let id = req.params.id
        if(id.length < 12){
            return res.status(400).json({success:false , msg:"Invalid Id"});
        }
        //convert string into mongo object id 
        id = new mongoose.Types.ObjectId(id);
    
        // finding if user exists 
        let user = await User.findById(id); 
        if(!user){
            return res.status(400).json({success:false,msg:"User Doesn't Exists"}); 
        }
        
        // checking if aleready subscribed 
        let subscriber = await Subscriber.find({email:user.email}); 
        if(subscriber.length > 0){
            return res.status(400).json({success:false,msg:"User Already Subscribed"}); 
        }
        // creating marketer 
        subscriber = new Subscriber({
            email:user.email 
        })

        let newsubscriber = await subscriber.save(); 
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
        if(id.length < 12){
            return res.status(400).json({success:false , msg:"Invalid Id"});
        }
        //convert string into mongo object id 
        id = new mongoose.Types.ObjectId(id);
        // findng if user exists 
        let user = await User.findById(id); 
        if(!user){
            return res.status(400).json({success:false,msg:"User Not Exists"}); 
        }

        // checking if subscribed or not 
        let subscriber = await Subscriber.findOneAndDelete({email:user.email}); 

        if(!subscriber){
            return res.status(400).json({success:false,msg:"User haven't Subscribed"}); 
        }

        res.status(200).json({success:true , msg:"User UnSubscribed"}); 
    } catch (error) {
        console.log(error.message);
        res.status(500).json({success:false,msg:'Internal Server Error'});
    }
})

module.exports = router ; 