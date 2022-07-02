const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    email :{
        type:String,
        unique:true ,
        required : true 
    },
    roll:{
        type:String,
        default:'Admin'
    },
    password:{
        type:String,
        min:3,
        required : true 
    }
},
{timestamps:true})

module.exports = mongoose.model('Admin',AdminSchema);