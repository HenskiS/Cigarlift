const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    client: {
        type: {}
    },
    cigars: {
        type: [{}]
    },
    cigarStrings: {
        type: [String]
    },
    total: Number,
    date: {
        type: Date,
        default: Date.now
    },
    filename: {
        type: String
    }
});

module.exports = mongoose.model('Order', orderSchema);