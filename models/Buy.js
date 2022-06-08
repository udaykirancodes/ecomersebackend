const mongoose = require('mongoose'); 

const BuySchema = new mongoose.Schema({
    userid :{
        type:mongoose.Schema.Types.ObjectId ,
        ref : 'User', 
        required:true 
    },
    list : {
        type:Array, 
        default:[]
    }
})

module.exports = mongoose.model('Buy',BuySchema);