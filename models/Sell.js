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
    }, 
    phone:{
        type:String,
    },
    details :{
        type:Object,
        required : true 
    }, 
    date:{
        type:Date,
        default:Date.now 
    }
})

module.exports = mongoose.model('Sell',SellSchema);