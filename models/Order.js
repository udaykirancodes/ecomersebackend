const mongoose = require('mongoose');

const BuySchema = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [
        {
            productid: {
                type: String,
            },
            quantity: {
                type: Number,
                default: 1,
            },
            _id: false,
        },
    ],
    status: {
        type: String,
        default: 'ordered'
    },
    phone: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: false
    },
    location: {
        type: Object,
        required: true
    }

},
    { timestamps: true })

module.exports = mongoose.model('Order', BuySchema);