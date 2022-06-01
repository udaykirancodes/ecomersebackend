const mongoose = require('mongoose');


// whenever a user is created , we create in the TempUser.
// & we send an OTP to user's email
// once the otp is verified , we will save in Users db , & delete in TempUser  


const UserSchema = new mongoose.Schema({
    email :{
        type:String,
        unique:true ,
        required : true 
    },
    name:{
        type:String,
        required:false 
    },
    password:{
        type:String,
        min:3,
        required : true 
    },
    phone:{
        type:String,
        required:false  
    },
    img :{
        type:String,
        required:false,
        default:'' 
    },
    emailVerified:{
        type:Boolean,
        default:false 
    },
    otp:{
        type:Number,
        required:false 
    },
    date:{
        type:Date,
        default:Date.now 
    }
})

module.exports = mongoose.model('TempUsers',UserSchema);