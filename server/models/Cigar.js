const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cigarSchema = new Schema({
    name: String,
    blend: String,
    size: String,
    price: Number,
    quantity: Number,
});

module.exports = mongoose.model('Cigar', cigarSchema);