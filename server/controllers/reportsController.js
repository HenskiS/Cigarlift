const Order = require('../models/Order')
const Itinerary = require('../models/Itinerary')

// @desc Get all reports
// @route GET /reports
// @access Private
const getAllReports = async (req, res) => {
    // Get all reports from MongoDB
    const reports = await Report.find().select('dba taxpayer address city').lean()

    // If no reports 
    if (!reports?.length) {
        return res.status(400).json({ message: 'No reports found' })
    }

    res.json(reports)
}

// @desc Get one report by id
// @route GET /reports/:id
// @access Private
const getReportById = async (req, res) => {
    const id = req.params.id

    // Generate report
    
    // Get date in YYYYMMDD
    const now = new Date(); // Current date and time
    const localDate = new Date(now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
    const today = localDate.toISOString().slice(0, 10).replace(/-/g, ''); // Format: YYYYMMDD

    // Get that day's itinerary
    //   - if no itinerary, no stops were made
    const itin = await Itinerary.find({date: today})

    // Get orders submitted that day

    // Get total cigars sold, total income

    // Get appointments made that day (look @ dateAdded)

    res.json(itin)
}

// @desc Create new report
// @route POST /reports
// @access Private
const createNewReport = async (req, res) => {
    const { license, dba, taxpayer, address, city, state, contact, phone, website, notes, isVisited, images } = req.body

    // Confirm data 
    if (!dba ) {
        return res.status(400).json({ message: 'DBA is required' })
    }

    let reportObject = {dba: dba}
    
    reportObject.dba = dba
    reportObject.license = license
    reportObject.taxpayer = taxpayer
    reportObject.address = address
    reportObject.city = city
    reportObject.state = state
    reportObject.contact = contact
    reportObject.phone = phone
    reportObject.website = website
    reportObject.notes = notes
    reportObject.isVisited = isVisited
    reportObject.images = images

    // Create and store new report 
    const report = await Report.create(reportObject)

    if (report) { //created 
        res.status(201).json({ message: `New report ${dba} created` })
    } else {
        res.status(400).json({ message: 'Invalid report data received' })
    }
}


module.exports = {
    getAllReports,
    getReportById,
    createNewReport,
}