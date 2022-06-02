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
    img:{
        type:String,
        required:true 
    }, 
    date:{
        type:Date,
        default:Date.now 
    }
})

module.exports = mongoose.model('Blogs',AdminSchema);