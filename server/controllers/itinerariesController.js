const Itinerary = require('../models/Itinerary')
const User = require('../models/User')
//const Note = require('../models/Note')
const bcrypt = require('bcrypt')

// @desc Get all users
// @route GET /users
// @access Private
const getItinerary = async (req, res) => {
    const { date } = req.body
    // Get all users from MongoDB
    const itin = await Itinerary.findOne({ date }).lean()

    // If no users 
    if (!itin) {
        return res.status(400).json({ message: 'No users found' })
    }

    res.json(itin)
}

// @desc Create new user
// @route POST /users
// @access Private
const createNewItinerary = async (req, res) => {
    const { username, password, roles } = req.body

    // Confirm data
    if (!username || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Check for duplicate username
    const duplicate = await User.findOne({ username }).collation({ locale: 'en', strength: 2 }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate username' })
    }

    // Hash password 
    const hashedPwd = await bcrypt.hash(password, 10) // salt rounds

    const userObject = (!Array.isArray(roles) || !roles.length)
        ? { username, "password": hashedPwd }
        : { username, "password": hashedPwd, roles }

    // Create and store new user 
    const user = await User.create(userObject)

    if (user) { //created 
        res.status(201).json({ message: `New user ${username} created` })
    } else {
        res.status(400).json({ message: 'Invalid user data received' })
    }
}

// @desc Update a user
// @route PATCH /users
// @access Private
const updateItinerary = async (req, res) => {
    const id = req.body.id.id
    const stopId = req.body.id.stopId


    // Confirm data 
    /*if (!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') {
        return res.status(400).json({ message: 'All fields except password are required' })
    }*/

    // Does the user exist to update?
    const itin = await Itinerary.findOne({ date: id }).exec()

    if (!itin) {
        return res.status(400).json({ message: 'itin not found' })
    }

    // Check for duplicate 
    // const duplicate = await User.findOne({ username }).collation({ locale: 'en', strength: 2 }).lean().exec()

    // Allow updates to the original user 
    /*if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate username' })
    }*/
    let locIndex = itin.stops.findIndex(loc => loc._id === stopId)
    if (locIndex !== -1) {
        console.log("Visiting location " + locIndex)
        itin.stops[locIndex].isVisited = true
    }

    /*if (password) {
        // Hash password 
        user.password = await bcrypt.hash(password, 10) // salt rounds 
    }*/

    const updatedItin = await itin.save()

    res.json({ message: `${updatedItin.date} updated` })
}

// @desc Delete a user
// @route DELETE /users
// @access Private
const deleteItinerary = async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'User ID Required' })
    }

    // Does the user still have assigned notes?
    /*const note = await Note.findOne({ user: id }).lean().exec()
    if (note) {
        return res.status(400).json({ message: 'User has assigned notes' })
    }*/

    // Does the user exist to delete?
    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    const result = await user.deleteOne()

    const reply = `Username ${result.username} with ID ${result._id} deleted`

    res.json(reply)
}

module.exports = {
    getItinerary,
    createNewItinerary,
    updateItinerary,
    deleteItinerary
}