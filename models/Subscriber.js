const mongoose = require('mongoose');

const SubScriberSchema = new mongoose.Schema({
    email :{
        type:String,
        required : true 
    },
    date:{
        type:Date,
        default:Date.now 
    }
})

module.exports = mongoose.model('Subscribers',SubScriberSchema);