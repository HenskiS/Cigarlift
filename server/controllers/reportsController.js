const Order = require('../models/Order')
const Itinerary = require('../models/Itinerary')
const Appointment = require('../models/Appointment')
const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')

dayjs.extend(utc);
dayjs.extend(timezone);

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
    const YYYYMMDD = req.params.id
    const date = dayjs.tz(YYYYMMDD, 'YYYYMMDD', 'America/Los_Angeles')

    // Generate report
    
    // Get date in YYYYMMDD
    const now = new Date(); // Current date and time
    const localDate = new Date(now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
    const today = localDate.toISOString().slice(0, 10).replace(/-/g, ''); // Format: YYYYMMDD

    // Get that day's itinerary
    //   - if no itinerary, no stops were made
    //   - look @ visitTime for... the time visited
    const itin = await Itinerary.findOne({date: YYYYMMDD}).exec()
    
    let stops = []
    if (itin) {
        stops = itin.stops.filter(stop => stop.isVisited)
    }
    
    // Get orders submitted that day
    const orders = await Order.find({
        date: {
            $gte: date.startOf('day').toDate(),
            $lt: date.endOf('day').toDate()
        }
    }).exec();

    // Get total cigars sold, total income
    let totalCigars = 0
    let totalCharged = 0
    let totalPayed = 0
    let totalCashPayed = 0
    let totalCheckPayed = 0
    let totalMOPayed = 0
    if (orders) {
        for (let i = 0; i < orders.length; i++) {
            const order = orders[i]
            if (order?.isTestOrder === true) continue; // don't count sales in test orders
            const payed = order.payed
            totalCharged += order.total
            totalPayed += payed.cash + payed.check + payed.moneyorder
            totalCashPayed += payed.cash
            totalCheckPayed += payed.check
            totalMOPayed += payed.moneyorder
            for (let j = 0; j < order.cigars.length; j++) {
                totalCigars += order.cigars[j].qty // qty is quantity ordered, "quantity" is inventory
            }
        }
    }
    const sales = {totalCigars, totalCharged, totalPayed, totalCashPayed, totalCheckPayed, totalMOPayed}

    // Get appointments made that day (look @ dateAdded)
    const appts = await Appointment.find({
        dateAdded: {
            $gte: date.startOf('day').toDate(),
            $lt: date.endOf('day').toDate()
        }
    }).exec();

    // return

    res.json({stops,
         orders,
         sales,
         appts})
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