const express = require('express')
const router = express.Router()
const Sell = require('../../models/Sell')
const { body, validationResult} = require('express-validator')

//Route 1: get price '/getprice' no login required
router.post('/getprice',[
    body('email').isEmail(),
    body('name').isLength({min: 3}),
    body('contact').isLength({min:10})
], async(req, res)=>{

    try{
        const {email, name, contact, vehicletype} = req.body;
        const sell = new Sell({
            email, name, contact, vehicletype
        })
        const saveSell = await sell.save();
        res.status(200).json({success:true, data: saveSell})
    } catch(error){
        console.log(error.message);
        res.status(500).json({success:false,msg:'Internal Server Error'});
    }
})

module.exports = router; 