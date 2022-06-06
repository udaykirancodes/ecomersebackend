const router = require('express').Router();
const {body , validationResult } = require('express-validator'); 

// importing models 
const Sell = require('../../models/Sell'); 

// routes 
router.post('/sell', 
[
    body('email','Invalid Email').isEmail(),
    body('fullName','Name Requried').isLength({min:2}),
    body('vechileNumber','Number Required').isLength({min:4})
]
,
async(req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(401).json({ success:false , msg: "Invalid Input" })
    }
    try {
        // find if already exists 
        let sell = await Sell.findOne({vechileNumber : req.body.vechileNumber}); 

        if(sell){
            return res.status(400).json({success:false,msg:"Data Found With this Registered Vechile Number"}); 
        }

        sell = new Sell({
            email:req.body.email,
            fullName:req.body.fullName,
            vechileNumber:req.body.vechileNumber,
            phone:req.body.phone, 
            vechileName:req.body.vechileName 
        })

        let newSell = await sell.save(); 

        res.status(200).json({success:true,data:newSell}); 

    } catch (error) {
        console.log(error.message);
        res.status(500).json({success:false,msg:'Internal Server Error'});
    }
    
})

module.exports = router ; 