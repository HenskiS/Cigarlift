const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const configSchema = new Schema({
    route: {},
    emails: {
        type: [String]
    }
});

module.exports = mongoose.model('Config', configSchema);