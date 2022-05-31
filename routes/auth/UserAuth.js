const router = require('express').Router();
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken'); 

const FetchUser = require('../../middlewares/FetchUser');


const config = require('../../config/config');
const JWT_SECRET = config.jwt.jwtsecret

// importing model
const User = require('../../models/User'); 

// 1.Register a user
// validation , try catch , hashing , jsonwebtoken 
router.post('/register', 
[
    body('email', 'Invalid Email').isEmail(),
    body('password', 'Password must be atleast 3 characters').isLength({ min: 3 })
],
async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(401).json({ success:false , msg: "Email or Password Error" })
    }

    //checking if user exists 
    let user = await User.findOne({email:req.body.email}); 
    if(user){
        return res.status(400).json({success:false , msg:"User Already Exists With This Email"})
    }

    // hashing the password 
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password , salt) 

    try {
        // trying to save the user 
        user = new User({
            email:req.body.email,
            password:hashedPassword,
            phone:req.body.phone,
            name:req.body.name,
            img:''
        })
        let newUser = await user.save(); 

        // creating authtoken and sending the token 
        const data = {
            user:{
                id:newUser.id
            }
        }
        const authToken = jwt.sign(data,JWT_SECRET); 

        res.status(200).json({success:true,authToken:authToken});
    } catch (error) {
        console.log(error.message);
        res.status(500).json({success:false,msg:'Internal Server Error'});
    }
})


// 2.Login a user 
router.post('/login', 
[
    body('email', 'Invalid Email').isEmail(),
    body('password', 'Password must be atleast 3 characters').isLength({ min: 3 })
],
async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(401).json({ success:false , msg: "Email or Password Error" })
    }
    let success = false ; 
    
    try {
        //checking if user exists 
        let user = await User.findOne({email:req.body.email}); 
        if(!user){
            return res.status(400).json({success:false , msg:"User Doesn't Exists With This Email"})
        }
        let comparePassword = await bcrypt.compare(req.body.password,user.password); 
        if (!comparePassword) {
            return res.status(401).json({ success, msg: "Email or Password Error" })
        }
        
        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET)
        success = true
        res.status(200).json({ success, authToken });
        
    } catch (error) {
        console.log(error.message);
        res.status(500).json({success:false,msg:'Internal Server Error'});
    }
})


router.put('/edit', FetchUser ,
async (req,res)=>{
    
    try {
        const user = await User.findById(req.user.id);
        if(!user){
            return res.status(400).json({success:false,msg:'user not found'});
        }
        const {name , phone } = req.body; 
        if(name){
            user.name = name;
        }
        if(phone){
            user.phone = phone;
        }
        const updatedUser = await user.save();
        res.status(200).json({success:true,data:updatedUser}); 
    } catch (error) {
        console.log(error.message)
        res.status(500).json({success:false,msg:'Internal Server Error'})
    }
})


module.exports = router; 