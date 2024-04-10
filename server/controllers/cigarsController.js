const Cigar = require('../models/Cigar')

// @desc Get all cigars
// @route GET /cigars
// @access Private
const getAllCigars = async (req, res) => {
    // Get all cigars from MongoDB
    const cigars = await Cigar.find().sort("name").sort("blend").lean()

    // If no cigars 
    if (!cigars?.length) {
        return res.status(400).json({ message: 'No cigars found' })
    }

    res.json(cigars)
}

// @desc Create new cigar
// @route POST /cigars
// @access Private
const createNewCigar = async (req, res) => {
    const { name, blend, size, price, quantity } = req.body

    // Confirm data
    if (!name || !price) {
        return res.status(400).json({ message: 'Name and price are required' })
    }

    // Check for duplicate username
    /*const duplicate = await Cigar.findOne({ username }).collation({ locale: 'en', strength: 2 }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate username' })
    }*/


    const cigarObject = { name, blend, size, price, quantity }

    // Create and store new cigar 
    const cigar = await Cigar.create(cigarObject)

    if (cigar) { //created 
        res.status(201).json({ message: `New cigar ${name} created` })
    } else {
        res.status(400).json({ message: 'Invalid cigar data received' })
    }
}

// @desc Update a cigar
// @route PATCH /cigars
// @access Private
const updateCigar = async (req, res) => {
    const { _id } = req.body
    const updateData = req.body

    // Confirm data 
    /*if (!name || !price) {
        return res.status(400).json({ message: 'Name and price are required' })
    }*/

    // Does the cigar exist to update?
    const cigar = await Cigar.findById(_id).exec()

    if (!cigar) {
        return res.status(400).json({ message: 'cigar not found' })
    }
    
    Object.assign(cigar, updateData)

    const updatedCigar = await cigar.save()

    res.json(updatedCigar)
}

// @desc Delete a cigar
// @route DELETE /cigars
// @access Private
const deleteCigar = async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Cigar ID Required' })
    }

    // Does the cigar still have assigned notes?
    /*const note = await Note.findOne({ cigar: id }).lean().exec()
    if (note) {
        return res.status(400).json({ message: 'Cigar has assigned notes' })
    }*/

    // Does the cigar exist to delete?
    const cigar = await Cigar.findById(id).exec()

    if (!cigar) {
        return res.status(400).json({ message: 'cigar not found' })
    }

    const result = await cigar.deleteOne()

    const reply = `Cigar ${result.name} with ID ${result._id} deleted`

    res.json(reply)
}

module.exports = {
    getAllCigars,
    createNewCigar,
    updateCigar,
    deleteCigar
}