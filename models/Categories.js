const mongoose = require('mongoose');

const Categories = new mongoose.Schema({
    blogs:{
        type: Array,
        default : []
    },
    products : {
        type : Array ,
        default : []
    }
},
{timestamps:true}
)

module.exports = mongoose.model('Categories',Categories);