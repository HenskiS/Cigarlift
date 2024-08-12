const Itinerary = require('../models/Itinerary')
const User = require('../models/User')
const Config = require('../models/Config');
const ClientModel = require('../models/Client')
//const Note = require('../models/Note')
const bcrypt = require('bcrypt')
const path = require('path');
const fs = require('fs');

const {Client} = require("@googlemaps/google-maps-services-js");


// @desc Get itinerary
// @route POST /itineraries/getByDate
// @access Private
const getItinerary = async (req, res) => {
    const { date } = req.body
    // Get all users from MongoDB
    const itin = await Itinerary.findOne({ date }).lean()

    // If no users 
    if (!itin) {
        //return res.status(400).json({ message: 'No itineraries found' })
        console.log("Creating new itinerary")
        createNewItinerary(req, res)
    } else res.json(itin)
}

// @desc Create new itinerary
// @route POST /itineraries
// @access Private
const createNewItinerary = async (req, res) => {
    const { date } = req.body

    let config = await Config.findOne()
    
    let clients = []
    clients = await ClientModel
                        .find({city: config.route.city1, isVisited: false})
                        .limit(config.route.routeLength)
                        .sort({zip: 1})
    
    // if not enough stops left in city1, look in city2
    let clients2 = []
    if (clients.length < config.route.routeLength) { 
        console.log("Not enough stops in City1")
        console.log("routeLength - clients.length = " + (config.route.routeLength - clients.length))
        clients2 = await ClientModel
                        .find({city: config.route.city2, isVisited: false})
                        .limit((config.route.routeLength - clients.length))// limit=routeLength-city1Stops
                        .sort({zip: 1})
        console.log("clients2.length = " + clients2.length)
                        // set city1 to city2, and city2 to blank
        config.route.city1 = config.route.city2
        config.route.city2 = ""
        console.log(config)
        await Config.findOneAndUpdate({}, config)
    }
    clients = clients.concat(clients2)
    console.log("clients.length = " + clients.length)
    console.log(config)

    const params = {
        key: process.env.GOOGLE_MAPS_API_KEY,
        origin: '106 Avenida Miramar, San Clemente, CA',
        destination: '106 Avenida Miramar, San Clemente, CA',
        waypoints: clients.map(c=> `${c.address}, ${c.city}, ${c.state}`),
        optimize: true // the important param
    }
    const client = new Client({})

    try {
        const response = await client.directions({ params,timeout: 1000, })
        const orderedClients = response.data.routes[0].waypoint_order.map(index => clients[index])
        console.log(response.data.routes[0].waypoint_order)
        const itinObject = {
            date,
            cigarsStart: 200,
            cigarsEnd: 200,
            stops: orderedClients
        }
        const itin = await Itinerary.create(itinObject)

        res.json(itin)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Error creating itinerary" })
    }
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
    try {
        const updateData = req.body;
        
        // Check if the itinerary exists before updating
        const itin = await Itinerary.findById(updateData._id);
        if (!itin) {
            return res.status(404).json({ message: 'Itinerary not found' });
        }

        // Update the itinerary
        const updatedItin = await Itinerary.findByIdAndUpdate(updateData._id, updateData, { new: true });

        // Return the updated itinerary in the response
        res.status(200).json(updatedItin);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }

    //let clientObject = await ClientModel.findById(stopId)
    //clientObject.isVisited = !clientObject.isVisited
    //const updatedClient = await clientObject.save()

    res.json({ message: `${updatedItin?.date} updated`, updatedItin })
}

// @desc Regenerate Itinerary
// @route POST /regenerate
// @access Private
const regenerateItinerary = async (req, res) => {
    const { itinerary } = req.body;
    const config = await Config.findOne();

    let clients = await ClientModel
        .find({city: config.route.city1, isVisited: false})
        .limit(config.route.routeLength)
        .sort({zip: 1});

    // If not enough stops in city1, look in city2
    if (clients.length < config.route.routeLength) {
        console.log("Not enough stops in City1");
        console.log("routeLength - clients.length = " + (config.route.routeLength - clients.length));
        const clients2 = await ClientModel
            .find({city: config.route.city2, isVisited: false})
            .limit((config.route.routeLength - clients.length))
            .sort({zip: 1});
        console.log("clients2.length = " + clients2.length);
        clients = clients.concat(clients2);

        // Update config to set city2 to blank
        config.route.city2 = "";
        await Config.findOneAndUpdate({}, config);
    }

    const params = {
        key: process.env.GOOGLE_MAPS_API_KEY,
        origin: '106 Avenida Miramar, San Clemente, CA',
        destination: '106 Avenida Miramar, San Clemente, CA',
        waypoints: clients.map(c => `${c.address}, ${c.city}, ${c.state}`),
        optimize: true
    }
    const client = new Client({});

    try {
        const response = await client.directions({ params, timeout: 1000 });
        const orderedClients = response.data.routes[0].waypoint_order.map(index => clients[index]);
        
        // Update the existing itinerary with new stops
        itinerary.stops = orderedClients;
        const updatedItinerary = await Itinerary.findByIdAndUpdate(itinerary._id, itinerary, { new: true });

        res.json(updatedItinerary);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error regenerating itinerary" });
    }
}
// @desc Reoptimize Route
// @route POST /reoptimize
// @access Private
const reOptimizeItinerary = async (req, res) => {
    const { itinerary } = req.body;

    const params = {
        key: process.env.GOOGLE_MAPS_API_KEY,
        origin: '106 Avenida Miramar, San Clemente, CA',
        destination: '106 Avenida Miramar, San Clemente, CA',
        waypoints: itinerary.stops.map(stop => `${stop.address}, ${stop.city}, ${stop.state}`),
        optimize: true
    }
    const client = new Client({});

    try {
        const response = await client.directions({ params, timeout: 1000 });
        const orderedStops = response.data.routes[0].waypoint_order.map(index => itinerary.stops[index]);
        
        // Update the existing itinerary with reordered stops
        itinerary.stops = orderedStops;
        const updatedItinerary = await Itinerary.findByIdAndUpdate(itinerary._id, itinerary, { new: true });

        res.json(updatedItinerary);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error re-optimizing itinerary" });
    }
}


// @desc Update a user
// @route POST /:id
// @access Private
const addStops = async (req, res) => {
    try {
        const id = req.params.id;
        const { stops } = req.body;
        
        // Check if the itinerary exists before updating
        const itin = await Itinerary.findById(id);
        if (!itin) {
            return res.status(404).json({ message: 'Itinerary not found' });
        }

        // Update the itinerary
        for (let i = 0; i < stops.length; i++) {
            const client = await ClientModel.findById(stops[i]._id);
            itin.stops.push(client);
        }
        const updatedItin = await itin.save();

        // Return the updated itinerary in the response
        res.status(200).json(updatedItin);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
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
    addStops,
    createNewItinerary,
    updateItinerary,
    deleteItinerary,
    getImage,
    regenerateItinerary,
    reOptimizeItinerary
}