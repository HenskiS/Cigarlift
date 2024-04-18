const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
    client: {
        type: {}
    },
    date: {
        type: Date
    },
    dateAdded: {
        type: Date,
        default: Date.now
    },
    notes: {
        type: String
    }
});

module.exports = mongoose.model('Appointment', appointmentSchema);