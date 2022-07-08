const router = require('express').Router(); 

// importing middleware 
const Feedback  = require('../../models/Feedback'); 

// POST A FEEDBACK :: 
router.post('/',async (req,res)=>{
    try {
        const {email , name , feedback} = req.body; 
        if(!email || !feedback){
            return res.status(400).json({success:false,msg:"All Fields are Required"});
        }
        let fb = new Feedback({
            email : email,
            name : name , 
            feedback : feedback 
        }); 
        let newFb = await fb.save(); 
        return res.status(200).json({success:true , data : "Feedback Received"}); 
    } catch (error) {
        console.log(error.message); 
        res.status(500).json({success:false,msg:"Internal Eerver Error"})
    }
})

// Get all the feedback :: ADMIN PROTECTED 
router.get('/',async (req,res)=>{
    try {
        const feedback = await Feedback.find(); 
        res.status(200).json({success:true,data:feedback}); 
    } catch (error) {
        console.log(error.message); 
        res.status(500).json({success:false,msg:"Internal Eerver Error"})
    }
})

module.exports = router ; 