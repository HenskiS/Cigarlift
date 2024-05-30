const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const noteHistorySchema = new mongoose.Schema({
    note: String,
    updatedBy: String,  // You might want to store user ID or username
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const clientSchema = new Schema({
    license: Number,
    taxpayer: String,
    dba: String,
    address: String,
    city: String,
    state: String,
    zip: String,
    contact: String,
    email: String,
    phone: String,
    website: String,
    notes: String,
    noteHistory: [noteHistorySchema],
    isVisited: Boolean,
    images: {
        locationImage: String,
        contractImage: String,
        licenseImage: String,
        humidorImage: String,
    }
});

module.exports = mongoose.model('Client', clientSchema);