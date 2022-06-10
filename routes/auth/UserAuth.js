const router = require('express').Router();
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken'); 
const nodemailer = require('nodemailer'); 


const FetchUser = require('../../middlewares/FetchUser');


const config = require('../../config/config');
const JWT_SECRET = config.jwt.jwtsecret

// importing model
const User = require('../../models/User'); 
// const TempUser = require('../../models/TempUser'); // email verification purpose 

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
        let min = 100000; 
        let max = 999999; 
        let randomNumber = Math.floor(Math.random() * (max - min) ) + min; 
        // trying to save the user 
        user = new User({
            email:req.body.email,
            password:hashedPassword,
            phone:req.body.phone,
            name:req.body.name,
            emailVerified:false,
            subscribed:false,
            otp: randomNumber 
        })
        let newUser = await user.save(); 
        // creating authtoken and sending the token 
        const data = {
            user:{
                id:newUser.id
            }
        }

        // sending otp via email 
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: config.email.id,
                pass: config.email.app_password  
            }
        });
        console.log(user.email)
        let info = await transporter.sendMail({
            from: config.email.id,
            to: user.email,
            subject:"Welcome to Metal-Station!!",
            text:
`We are Happy to see you at Metal-Station.
Your OTP is : ${user.otp}
Kindly do not share with anybody!`
          }, function (error, info) {
              if (error) {
                  console.log(error.message)
                  res.status(400).json({success:false,msg:"We coudn't send you email!",error:error.message})
                } else {
                //   console.log('Mail Sent')
                // res.status(200).json({success:true,msg:"Email Sent Successfully"}); 
                // sending authtoken if user email is valid 
                const authToken = jwt.sign(data,JWT_SECRET); 
                console.log('Email Sent'); 
                res.status(200).json({success:true,authToken:authToken});
              }
          });


    } catch (error) {
        console.log(error.message);
        res.status(500).json({success:false,msg:'Internal Server Error'});
    }
})


// email verification
router.post('/verify',
[
    body('email','Invalid Email').isEmail(),
],
async(req,res)=>{

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(401).json({ success:false , msg: "Invalid Email" })
        }
    
        //checking if user exists 
        let VerificationUser = await User.findOneAndUpdate({email:req.body.email}); 
        if(!VerificationUser){
            return res.status(400).json({success:false , msg:"User Doesn't Exists With This Email"})
        }

        // validating (if otp is matched)
        if(VerificationUser.otp===req.body.otp){
            VerificationUser.emailVerified = true; 
            VerificationUser.subscribed=true 
            // updating the password 
            // hashing the password 
            if(req.body.password){
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(req.body.password , salt) 
                VerificationUser.password = hashedPassword
            }
            VerificationUser.otp=null 
            // creating authtoken and sending the token 
            const data = {
                user:{
                    id:VerificationUser.id
                }
            }
            
            let newuser = await VerificationUser.save(); 
            const authToken = jwt.sign(data,JWT_SECRET); 
            res.status(200).json({success:true,authToken:authToken});
        }
        else{
            // if otp is not matched 
            return res.status(401).json({ success:false , msg: "OTP Doesn't Matched" })
        }

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




// user info edit option :: protected for user (own account can be edited not other's)
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
const FetchAdmin = require('../../middlewares/FetchAdmin'); 
router.get('/getall',FetchAdmin , async(req,res)=>{
    try {
        let users = await User.find().select('-password'); 
        res.status(200).json({success:true,users:users})
    } catch (error) {
        res.status(500).json({success:false,msg:'Internal Server Error'})
    }
})

// password reset || forgot password 

router.post('/reset',
[
    body('email','Invalid Email').isEmail()
],
async (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(401).json({ success:false , msg: "Invalid Email"})
    }

    // finding user 
    let user = await User.findOneAndUpdate({email:req.body.email}); 
    if(!user){
        return res.status(400).json({success:false,msg:"User Not Found"})
    }


    // generating otp 
    let min = 100000; 
    let max = 999999; 
    let otp = Math.floor(Math.random() * (max - min) ) + min; 
    
    // updating the otp 
    user.otp = otp ; 
    
    let newuser = await user.save(); 
    // send email with otp 
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: config.email.id,
            pass: config.email.app_password  
        }
    });
    let info = await transporter.sendMail({
        from: config.email.id,
        to: req.body.email,
        subject:"OTP for Password Reset!!",
        text:`
We are Happy to see you at Metal-Station.
Your OTP is : ${otp}
Kindly do not share with anybody!
        `
      }, function (error, info) {
          if (error) {
              console.log(error.message)
              res.status(400).json({success:false,msg:"Error in sending email",error:error.message})
            } else {
            //   console.log('Mail Sent')
              res.status(200).json({success:true,msg:"Email Sent Successfully"}); 
          }
      });
})




// google authentication 

// Google Login 
const { OAuth2Client } = require('google-auth-library');

const CLIENT_ID = config.oauth.client_id 

const client = new OAuth2Client(CLIENT_ID)

router.post('/googlelogin', async (req, res) => {
    try {
            const tokenId  = req.body.tokenId;
            const result = await client.verifyIdToken({ idToken: tokenId, audience: CLIENT_ID })
         
                const email_verified = result.payload.email_verified;
                const name = result.payload.name ; 
                const email = result.payload.email ; 

                let user ; 
                success = false ; 
                if (email_verified) {
                    user = await User.findOne({ email: email });
                    if (user) {
                        // already in database 
                        const data = {
                            user: {
                                id: user.id
                            }
                        }
                        const authToken = jwt.sign(data, JWT_SECRET)
                        success = true
                        res.status(200).json({ success, authToken });
                    }
                    else {
                        // we need to create a user with the same details 
                        let generatedPassword = email + '12345'; 
                        const salt = await bcrypt.genSalt(10)
                        const hashedPassword = await bcrypt.hash(generatedPassword, salt)
                        try {
                            user = new User({
                                email:email,
                                password:hashedPassword,
                                name:name,
                                emailVerified:true,
                                subscribed:true,
                                otp: null  
                            })
                            const newUser = await user.save();
                            const data = {
                                user: {
                                    id: user.id
                                }
                            }
                            const authToken = jwt.sign(data, JWT_SECRET)
                            success = true
                            res.status(200).json({ success, authToken });
                        } catch (error) {
                            res.status(401).json({ success, msg: "Internal Server Error" })
                        }
                    }
                }
                else{
                    res.status(404).json({success:false , msg:"Email Not Verified"})
                }
            } catch (error) {
                res.status(400).json({success:false , msg: "Internal Server Error"+error.message });
            }
})



module.exports = router; 