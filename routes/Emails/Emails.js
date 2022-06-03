const router = require('express').Router(); 
const {body , validationResult } = require('express-validator'); 

const nodemailer = require("nodemailer");

const config = require('../../config/config'); 

// importing middlewares 
const FetchAdmin = require('../../middlewares/FetchAdmin'); 

// importing models 
const Users = require('../../models/User')

// required things for mailing 

router.post('/send',
FetchAdmin, 
[
    body('subject').isLength({min:1}),
    body('text').isLength({min:3}),
], 
async (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(401).json({ success:false , msg: "All Fields are Required" })
    }
    try {
        let id = req.body.to; 
        if(!id){
            return res.status(400).json({success:false,msg:'Invalid Id'});
        }
        let users; 
        // choosing btw subscribers & unsubscribers 
        if(id==="subscribers"){
            users = await Users.find({subscribed:true}); 
        }
        else if(id==="unsubscribers"){
            users = await Users.find({subscribed:false}); 
        }
        else{
            return res.status(400).json({success:false,msg:'Invalid Id'});
        }

        // finding gmails from list 
        let receivers = await users.map(element =>{
            if(element.emailVerified){
                return element.email 
            }
        })
        if(receivers.length===0){
            return res.status(400).json({success:false,msg:"No Users Found"})
        }
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: config.email.id,
                pass: config.email.app_password  
            }
        });
        let info = await transporter.sendMail({
            from: config.email.id,
            to: receivers,
            subject:req.body.subject,
            text:req.body.text 
          }, function (error, info) {
              if (error) {
                  console.log(error.message)
                  res.status(400).json({success:false,msg:"Error in sending email",error:error.message})
                } else {
                //   console.log('Mail Sent')
                  res.status(200).json({success:true,msg:"Email Sent Successfully"}); 
              }
          });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({success:false,msg:'Internal Server Error'});
    }
})





module.exports = router ; 