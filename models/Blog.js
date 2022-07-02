const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    title :{
        type:String,
        min:5, 
        required : true 
    },
    description:{
        type:String,
        required : true 
    },
    isDeleted:{
        type:Boolean,
        required:true , 
        default:false 
    }, 
    img:{
        type:String,
        required:true 
    }, 
    date:{
        type:Date,
        default:Date.now 
    },
    category:{
        type:Array,
        default:[]
    }
},
{timestamps:true}
)

module.exports = mongoose.model('Blogs',AdminSchema);