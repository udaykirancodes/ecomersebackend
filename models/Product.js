const mongoose = require('mongoose');
const ProductSchema = new mongoose.Schema({
    name :{
        type:String,
        required : true,
        min:5
    },
    description:{
        type:String,
        required:false 
    }, 
    category:{
        type:String,
        required:true 
    },
    subCategory:{
        type:Array,
        required:false ,
        default:[]
    }, 
    details:{
        type:Object,
        required:true  
    },
    isDeleted:{
        type:Boolean,
        required:true , 
        default:false 
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
},
{timestamps:true})

module.exports = mongoose.model('Products',ProductSchema);