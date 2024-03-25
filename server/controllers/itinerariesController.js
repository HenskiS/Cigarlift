const Itinerary = require('../models/Itinerary')
const User = require('../models/User')
const Client = require('../models/Client')
//const Note = require('../models/Note')
const bcrypt = require('bcrypt')
const path = require('path');
const fs = require('fs');

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
    const { date } = req.body

    const clients = await
    Client
    .find({city: "SAN CLEMENTE", isVisited: false})
    .limit(10)
    .sort({zip: 1})
    //.select('_id ')
    const itinObject = {
        date,
        cigarsStart: 200,
        cigarsEnd: 200,
        stops: clients
    }
    const itin = await Itinerary.create(itinObject)

    res.json(itin)
    // Create and store new user 
    /*const user = await User.create(userObject)

    if (user) { //created 
        res.status(201).json({ message: `New itinerary ${username} created` })
    } else {
        res.status(400).json({ message: 'Invalid itinerary data received' })
    }*/
}

// @desc Update a user
// @route PATCH /users
// @access Private
const updateItinerary = async (req, res) => {
    const id = req.body.id.id
    const stopId = req.body.id.stopId

    // Does the itin exist to update?
    const itin = await Itinerary.findOne({ date: id }).exec()

    if (!itin) {
        return res.status(400).json({ message: 'itin not found' })
    }

    let locIndex = itin.stops.findIndex(loc => loc._id.toString() === stopId)
    if (locIndex !== -1) {
        const visited = itin.stops[locIndex].isVisited
        console.log("Visiting location " + locIndex)
        itin.stops.set(locIndex, { ...itin.stops[locIndex], isVisited: !visited });

        console.log("isVisited: " + itin.stops[locIndex].isVisited)
    }

    const updatedItin = await itin.save()

    res.json({ message: `${updatedItin.date} updated`, updatedItin })
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

const getImage = async (req, res) => {
    const imageToBase64 = require('image-to-base64')
    const imageName = req.params.imageName
    const imagePath = path.join(__dirname, '../images', imageName)
    if (fs.existsSync(imagePath)) {
        // Set the appropriate content type for the response
        //res.setHeader('Content-Type', 'image/jpeg'); // Adjust the content type based on the image type (e.g., jpeg, png)
        
        //console.log("Sending image at location:")
        //console.log(imagePath)
        
        // Read the image file and stream it back as the response
        //const stream = fs.createReadStream(imagePath);
        //stream.pipe(res);
        //res.sendFile(imagePath)
        imageToBase64(imagePath).then(response => res.send(response))
      } 
    else {
        console.log("couldn't find that image at path:")
        console.log(imagePath)
        res.status(404).send('Image not found');
    }
}

module.exports = {
    getItinerary,
    createNewItinerary,
    updateItinerary,
    deleteItinerary,
    getImage
}