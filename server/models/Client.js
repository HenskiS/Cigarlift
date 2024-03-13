const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clientSchema = new Schema({
    license: Number,
    taxpayer: String,
    dba: String,
    address: String,
    city: String,
    state: String,
    zip: String,
    contact: String,
    phone: String,
    website: String,
    notes: String,
    isVisited: Boolean,
    images: [String]
});

module.exports = mongoose.model('Client', clientSchema);