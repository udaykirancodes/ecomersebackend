const mongoose = require('mongoose');

const SellSchema = new mongoose.Schema({
    email :{
        type:String,
        required : true 
    },
    fullName :{
        type:String, 
    }, 
    vechileName : {
        type:String 
    }, 
    phone:{
        type:String,
    },
    vechileNumber :{
        type:String,
        required : true 
    }, 
    date:{
        type:Date,
        default:Date.now 
    }
})

module.exports = mongoose.model('Sell',SellSchema);