const mongoose = require('mongoose'); 

const BuySchema = new mongoose.Schema({
    userid :{
        type:mongoose.Schema.Types.ObjectId ,
        ref : 'User', 
        required:true 
    },
    productid : {
        type:mongoose.Schema.Types.ObjectId, 
        ref : 'Product',
        required:true 
    },
    status : {
        type:String,
        default:'ordered'
    },
    name : {
        type:String, 
        required:true 
    },
    email : {
        type : String,
        required : false 
    },
    productname:{
        type:String,
        required:true 
    }, 
    phone : {
        type : String,
        required : true 
    }, 
    price : {
        type : Number , 
        required : false 
    },

},
{timestamps:true})

module.exports = mongoose.model('Order',BuySchema);