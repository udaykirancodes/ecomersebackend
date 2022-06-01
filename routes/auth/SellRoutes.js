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
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array() });
    }

    try{
        const {email, name, contact, vehicletype} = req.body;
        const sell = new Sell({
            email, name, contact, vehicletype
        })
        const saveSell = await sell.save();
        res.json(saveSell);
    } catch(error){
         res.status(500).send("Some Error Occured Try to Sell it Again")
    }
})

module.exports = router; 