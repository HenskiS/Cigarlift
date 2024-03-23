const Client = require('../models/Client')
//const Note = require('../models/Note')
const bcrypt = require('bcrypt')

// @desc Get all clients
// @route GET /clients
// @access Private
const getAllClients = async (req, res) => {
    // Get all clients from MongoDB
    const clients = await Client.find().select('dba taxpayer address city').lean()

    // If no clients 
    if (!clients?.length) {
        return res.status(400).json({ message: 'No clients found' })
    }

    res.json(clients)
}

// @desc Get one client by id
// @route GET /clients/:id
// @access Private
const getClientById = async (req, res) => {
    const id = req.params.id
    console.log("id:")
    console.log(id)

    // Does the client exist?
    const client = await Client.findById(id).exec()

    if (!client) {
        return res.status(400).json({ message: 'Client not found' })
    }
    console.log("---found client---")
    res.json(client)
}

// @desc Create new client
// @route POST /clients
// @access Private
const createNewClient = async (req, res) => {
    const { username, password, roles } = req.body

    // Confirm data
    if (!username || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Check for duplicate username
    const duplicate = await Client.findOne({ username }).collation({ locale: 'en', strength: 2 }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate username' })
    }

    // Hash password 
    const hashedPwd = await bcrypt.hash(password, 10) // salt rounds

    const clientObject = (!Array.isArray(roles) || !roles.length)
        ? { username, "password": hashedPwd }
        : { username, "password": hashedPwd, roles }

    // Create and store new client 
    const client = await Client.create(clientObject)

    if (client) { //created 
        res.status(201).json({ message: `New client ${username} created` })
    } else {
        res.status(400).json({ message: 'Invalid client data received' })
    }
}

// @desc Update a client
// @route PATCH /clients
// @access Private
const updateClient = async (req, res) => {
    const { id, license, dba, taxpayer, address, city, state, contact, phone, website, notes, isVisited, images } = req.body

    // Confirm data 
    if ( !id || !dba ) {
        return res.status(400).json({ message: 'DBA is required' })
    }

    // Does the client exist to update?
    const client = await Client.findById(id).exec()

    if (!client) {
        return res.status(400).json({ message: 'Client not found' })
    }

    // Check for duplicate 
    //const duplicate = await Client.findOne({ username }).collation({ locale: 'en', strength: 2 }).lean().exec()

    // Allow updates to the original client 
    /*if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate username' })
    }*/
    
    client.dba = dba
    client.taxpayer = taxpayer
    client.address = address
    client.city = city
    client.state = state
    client.contact = contact
    client.phone = phone
    client.website = website
    client.notes = notes
    client.isVisited = isVisited
    client.images = images

    const updatedClient = await client.save()

    res.json({ message: `${updatedClient.dba} updated` })
}

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
    getClientById,
    createNewClient,
    updateClient,
    deleteClient
}