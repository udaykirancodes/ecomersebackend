const mongoose = require('mongoose');
const {Schema} = mongoose;
const SellSchema = new Schema({
    vehicletype:{
        type: String, possibleValues:['two_wheeler', 'three_wheeler', 'four_wheeler']
    },
    name:{
        type: String,
        required: true
    },
    contact:{
        type: Number,
        required: true
    },
    email:{
        type: String,  
        required: true
    }

});

module.exports = mongoose.model('Sell', SellSchema)