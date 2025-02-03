const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    client: {
        type: {}
    },
    cigars: {
        type: [{}]
    },
    total: Number,
    payed: {
        type: {
            cash: Number,
            check: Number,
            moneyorder: Number
        }
    },
    date: {
        type: Date,
        default: Date.now
    },
    filename: {
        type: String
    },
    isTestOrder: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Order', orderSchema);