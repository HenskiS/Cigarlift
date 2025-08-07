const Appointment = require('../models/Appointment')
const Client = require('../models/Client')
//const Note = require('../models/Note')
const bcrypt = require('bcrypt')

// @desc Get all clients
// @route GET /clients
// @access Private
const getAllClients = async (req, res) => {
    // Get all clients from MongoDB
    const clients = await Client.find().select('dba taxpayer address city orders isManuallyAdded').lean()

    // If no clients 
    if (!clients?.length) {
        return res.status(400).json({ message: 'No clients found' })
    }

    res.json(clients)
}
// @desc Get all clients
// @route GET /clients/cities
// @access Private
const getCities = async (req, res) => {
    // Get all clients from MongoDB
    const cities = await Client.find().distinct('city').lean()

    // If no clients 
    if (!cities?.length) {
        return res.status(400).json({ message: 'No cities found' })
    }

    res.json(cities)
}

// @desc Get one client by id
// @route GET /clients/:id
// @access Private
const getClientById = async (req, res) => {
    const id = req.params.id

    // Does the client exist?
    const client = await Client.findById(id).exec()

    if (!client) {
        return res.status(400).json({ message: 'Client not found' })
    }
    res.json(client)
}

// @desc Create new client
// @route POST /clients
// @access Private
const createNewClient = async (req, res) => {
    const { license, dba, taxpayer, email, address, city, state, contact, phone, website, notes, isVisited, images } = req.body

    // Confirm data 
    if (!dba ) {
        return res.status(400).json({ message: 'DBA is required' })
    }

    let clientObject = {dba: dba}
    
    clientObject.dba = dba
    clientObject.license = license
    clientObject.taxpayer = taxpayer
    clientObject.email = email
    clientObject.address = address
    clientObject.city = city
    clientObject.state = state
    clientObject.contact = contact
    clientObject.phone = phone
    clientObject.website = website
    clientObject.notes = notes
    clientObject.isVisited = isVisited
    clientObject.images = images
    clientObject.isManuallyAdded = true

    // Create and store new client 
    const client = await Client.create(clientObject)

    if (client) { //created 
        res.status(201).json({ message: `New client ${dba} created` })
        // In case the new client was made from Appt page "New Client" field,
        //  get appts with the same dba and replace that client with the new client,
        //  to fill in missing info. Otherwise appt will only have dba.
        let appts = await Appointment.find({client: {dba: client.dba}})
        for (let i = 0; i < appts.length; i++) {
            appts[i].client = client
            await appts[i].save()
            console.log("Updated appointment info for " + appts[i].client.dba)
        }
    } else {
        res.status(400).json({ message: 'Invalid client data received' })
    }
}

// @desc Update a client's notes
// @route PATCH /clients/update-notes/:id
// @access Private
const updateNotes = async (req, res) => {
    const clientId = req.params.id;
    console.log(req.body)
    const { newNotes, updatedBy } = req.body;

    // Does the client exist to update?
    const client = await Client.findById( clientId ).exec()

    if (!client) {
        return res.status(400).json({ message: 'Client not found' })
    }

    if (client.notes === newNotes) {
        return res.status(200).json({ message: 'Notes not updated' })
    }

    client.noteHistory.push({
        note: client.notes,
        updatedBy,
        updatedAt: new Date(),
    })

    client.notes = newNotes

    const updatedClient = await client.save()

    res.json({ message: `${updatedClient.dba} updated`, client: updatedClient })
}
// @desc Update a client
// @route PATCH /clients
// @access Private
// THis seems like way too much code for an update endpoint.Do we even need to destructure it all, can't we just update whatever fields are sent?
const updateClient = async (req, res) => {
    const { id, _id } = req.body;
    const clientId = id || _id;

    if (!clientId) {
        return res.status(400).json({ message: 'Client ID is required' });
    }

    try {
        const updatedClient = await Client.findByIdAndUpdate(
            clientId,
            { $set: req.body },
            { new: true }
        );

        if (!updatedClient) {
            return res.status(404).json({ message: 'Client not found' });
        }

        res.json({ message: `${updatedClient.dba} updated` });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// This version:
// 1. Only requires an ID
// 2. Uses findByIdAndUpdate with $set to update only the fields present in req.body
// 3. Returns the updated document with {new: true}
// 4. Includes error handling
// 5. Is much shorter while maintaining functionality


// @desc Delete a client
// @route DELETE /clients
// @access Private
const deleteClient = async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Client ID Required' })
    }

    // Does the client still have assigned notes?
    /*const note = await Note.findOne({ client: id }).lean().exec()
    if (note) {
        return res.status(400).json({ message: 'Client has assigned notes' })
    }*/

    // Does the client exist to delete?
    const client = await Client.findById(id).exec()

    if (!client) {
        return res.status(400).json({ message: 'Client not found' })
    }

    const result = await client.deleteOne()

    const reply = `Username ${result.username} with ID ${result._id} deleted`

    res.json(reply)
}

module.exports = {
    getAllClients,
    getCities,
    getClientById,
    createNewClient,
    updateClient,
    updateNotes,
    deleteClient
}