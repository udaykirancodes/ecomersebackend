const mongoose = require('mongoose');

const WishListSchema = new mongoose.Schema({
    userid:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' ,
        required : true 
    },
    list:{
        type:Array,
    },
    interests:{
        type:Array 
    }
})

module.exports = mongoose.model('WishList',WishListSchema);