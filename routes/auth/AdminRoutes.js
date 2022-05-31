const router = require('express').Router();
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken'); 

const FetchAdmin = require('../../middlewares/FetchAdmin');


const config = require('../../config/config');
const JWT_SECRET = config.jwt.jwtsecret

// importing model
const Admin = require('../../models/Admin'); 

// 1.Register a admin
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

    //checking if admin exists 
    let admin = await Admin.findOne({email:req.body.email}); 
    if(admin){
        return res.status(400).json({success:false , msg:"Admin Already Exists With This Email"})
    }

    // hashing the password 
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password , salt) 

    try {
        // trying to save 
        admin = new Admin({
            email:req.body.email,
            password:hashedPassword,
        })
        let newAdmin = await admin.save(); 

        // creating authtoken and sending the token 
        const data = {
            admin:{
                id:newAdmin.id
            }
        }
        const adminToken = jwt.sign(data,JWT_SECRET); 

        res.status(200).json({success:true,adminToken:adminToken});
    } catch (error) {
        console.log(error.message);
        res.status(500).json({success:false,msg:'Internal Server Error'});
    }
})


// 2.Login a admin 
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
        //checking if admin exists 
        let admin = await Admin.findOne({email:req.body.email}); 
        if(!admin){
            return res.status(400).json({success:false , msg:"Admin Doesn't Exists With This Email"})
        }
        let comparePassword = await bcrypt.compare(req.body.password,admin.password); 
        if (!comparePassword) {
            return res.status(401).json({ success, msg: "Email or Password Error" })
        }
        
        const data = {
            admin: {
                id: admin.id
            }
        }
        const adminToken = jwt.sign(data, JWT_SECRET)
        success = true
        res.status(200).json({ success, adminToken });
        
    } catch (error) {
        console.log(error.message);
        res.status(500).json({success:false,msg:'Internal Server Error'});
    }
})



module.exports = router; 