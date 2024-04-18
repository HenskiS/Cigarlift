const { default: mongoose } = require('mongoose')
const Appointment = require('../models/Appointment')
const puppeteer = require("puppeteer");
const sendEmail = require('../middleware/emailHandler');


// @desc Get all appointments
// @route GET /appointments
// @access Private
const getAllAppointments = async (req, res) => {
    // Get all appointments from MongoDB
    const appointments = await Appointment.find().lean()

    // If no appointments 
    if (!appointments?.length) {
        return res.status(400).json({ message: 'No appointments found' })
    }

    res.json(appointments)
}

// @desc Get one appointment by id
// @route GET /appointments/:id
// @access Private
const getAppointmentById = async (req, res) => {
    const id = req.params.id
    console.log(id)
    //const mongoID = new mongoose.Types.ObjectId(id)
    // Does the client exist?
    const appointment = await Appointment.findById(id).exec()

    if (!appointment) {
        return res.status(400).json({ message: 'Appointment not found' })
    }
    res.status(200).json(appointment)
}
    

// @desc Create new appointment
// @route POST /appointments
// @access Private
const createNewAppointment = async (req, res) => {
    const { client, date, notes } = req.body

    // Confirm data
    if (!client || !date || !notes) {
        return res.status(400).json({ error: 'Client, date, and notes are required' })
    }

    let event = new Date()
    let time = event.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }).replaceAll(":",".").replaceAll("/","-")
    let filename = `Appointment ${time} ${client.dba}.pdf`

    const appointmentObject = { client, date, notes }

    // Create and store new appointment 
    const appointment = await Appointment.create(appointmentObject)

    if (appointment) { //created 
        res.status(201).json({ success: `New appointment created: ${client.dba}` })
    } else {
        res.status(400).json({ error: 'Invalid appointment data received' })
    }
}

// @desc Update a appointment
// @route PATCH /appointments
// @access Private
const updateAppointment = async (req, res) => {
    const { _id } = req.body
    const updateData = req.body

    // Confirm data 
    /*if (!name || !price) {
        return res.status(400).json({ message: 'Name and price are required' })
    }*/

    // Does the appointment exist to update?
    const appointment = await Appointment.findById(_id).exec()

    if (!appointment) {
        return res.status(400).json({ message: 'appointment not found' })
    }
    
    Object.assign(appointment, updateData)

    const updatedAppointment = await appointment.save()

    res.json(updatedAppointment)
}

// @desc Delete a appointment
// @route DELETE /appointments
// @access Private
const deleteAppointment = async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Appointment ID Required' })
    }

    // Does the appointment still have assigned notes?
    /*const note = await Note.findOne({ appointment: id }).lean().exec()
    if (note) {
        return res.status(400).json({ message: 'Appointment has assigned notes' })
    }*/

    // Does the appointment exist to delete?
    const appointment = await Appointment.findById(id).exec()

    if (!appointment) {
        return res.status(400).json({ message: 'appointment not found' })
    }

    const result = await appointment.deleteOne()

    const reply = `Appointment ${result.name} with ID ${result._id} deleted`

    res.json(reply)
}

module.exports = {
    getAllAppointments,
    getAppointmentById,
    createNewAppointment,
    updateAppointment,
    deleteAppointment
}