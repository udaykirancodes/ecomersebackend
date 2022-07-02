const mongoose = require('mongoose');

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
    emailVerified:{
        type:Boolean,
        default:false 
    },
    otp:{
        type:Number,
        default:false 
    }, 
    subscribed:{
        type:Boolean,
        default:true 
    }, 
    wishlist:{
        type:Array,
        required:false, 
        default:[]
    }, 
    interests:{
        type:Array , 
        required:false, 
        default:[]
    }, 
    orders : {
        type:Array,
        required:false,
        default:[]
    },
    date:{
        type:Date,
        default:Date.now 
    }
},
{timestamps:true})

module.exports = mongoose.model('Users',UserSchema);