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
        return res.status(401).json({ success:false , msg: "All Fields are Required" ,errors})
    }
    try {
        let emails = req.body.emailids; 

        if(emails.length == 0){
            return res.status(400).json({success:false,msg:"No Emails to send Mail"})
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
            to: emails,
            subject:req.body.subject,
            text:req.body.text 
          }, function (error, info) {
              if (error) {
                  console.log(error.message)
                  res.status(400).json({success:false,msg:"Error in sending email",error:error.message})
                } else {
                  console.log('Mail Sent')
                  res.status(200).json({success:true,msg:"Email Sent Successfully"}); 
              }
          });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({success:false,msg:'Internal Server Error'});
    }
})





module.exports = router ; 