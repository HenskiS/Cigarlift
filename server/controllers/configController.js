const Itinerary = require('../models/Itinerary')
const Config = require('../models/Config');

const path = require('path');
const fs = require('fs');

// @desc Get route config
// @route GET /config
// @access Private
const getConfig = async (req, res) => {
    // Get all users from MongoDB
    const routeConfig = await Config.findOne().lean()

    // If no users 
    if (!routeConfig) {
        return res.status(400).json({ message: 'No config found' })
    }

    res.json(routeConfig)
}

// @desc Update config
// @route PATCH /users
// @access Private
const updateConfig = async (req, res) => {
    const newConfig = req.body.config
    console.log(newConfig)

    // Does the itin exist to update?
    let config = await Config.findOne({  }).exec()

    if (!config) {
        return res.status(400).json({ message: 'config not found' })
    }
    config = newConfig

    const updatedConfig = await Config.findOneAndUpdate({}, newConfig)

    res.json({ message: "Config updated", updatedConfig })
}


module.exports = {
    getConfig,
    updateConfig
}