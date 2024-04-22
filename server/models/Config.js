const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const configSchema = new Schema({
    route: {},
});

module.exports = mongoose.model('Config', configSchema);