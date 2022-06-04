const mongoose = require('mongoose');
const ProductSchema = new mongoose.Schema({
    name :{
        type:String,
        required : true,
        min:5
    },
    category:{
        type:String,
        required:true 
    },
    details:{
        type:Object,
        required:true  
    },
    price:{
        type:Number,
        required:true 
    },
    img:{
        type:Array,
        required:true 
    },
    date:{
        type:Date,
        default:Date.now 
    }
})

module.exports = mongoose.model('Products',ProductSchema);