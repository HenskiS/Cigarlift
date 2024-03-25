const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itinerarySchema = new Schema({
    date: {
        type: String,
        required: true
    },
    stops: {
        type: Array,/*[{
            _id: String,
            name: String,
            address: String,
            isVisited: Boolean
        }]*/
    },
    cigarsStart: {
        type: Number
    },
    cigarsEnd: {
        type: Number
    }
});

module.exports = mongoose.model('Itinerary', itinerarySchema);