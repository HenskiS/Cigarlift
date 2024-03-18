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
    images: {
        locationImage: String,
        contractImage: String,
        licenseImage: String,
        humidorImage: String,
    }
});

module.exports = mongoose.model('Client', clientSchema);