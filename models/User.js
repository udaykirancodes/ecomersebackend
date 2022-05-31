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
    img :{
        type:String,
        required:false,
        default:'' 
    },
    date:{
        type:Date,
        default:Date.now 
    }
})

module.exports = mongoose.model('Users',UserSchema);