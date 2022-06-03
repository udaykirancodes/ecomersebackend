const router = require('express').Router(); 
const {body , ValidationResult } = require('express-validator'); 

const nodemailer = require("nodemailer");

const config = require('../../config/config'); 

// importing middlewares 
const FetchAdmin = require('../../middlewares/FetchAdmin'); 

// importing models 
const Subscribers = require('../../models/Subscriber'); 

// required things for mailing 
const {google} = require('googleapis'); 


const CLIENT_ID = config.oauth.client_id;
const CLIENT_SECRET = config.oauth.client_secret;
const REDIRECT_URI = config.oauth.client_redirect; 

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID , CLIENT_SECRET , REDIRECT_URI)
router.post('/send',

async (req,res)=>{
    
})




module.exports = router ; 