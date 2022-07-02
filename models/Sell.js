const mongoose = require('mongoose');

const SellSchema = new mongoose.Schema({
    email :{
        type:String,
        required : true 
    },
    fullName :{
        type:String, 
    }, 
    type : {
        type:String,
        required:true 
    }, 
    phone:{
        type:String,
        required:true 
    },
    details :{
        type:Object,
        required : true 
    }, 
    date:{
        type:Date,
        default:Date.now 
    }
},
{timestamps:true})

module.exports = mongoose.model('Sell',SellSchema);