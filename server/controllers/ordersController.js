const { default: mongoose } = require('mongoose')
const Order = require('../models/Order')
const puppeteer = require("puppeteer");
const sendEmail = require('../middleware/emailHandler');
const Cigar = require('../models/Cigar');


const generatePDF = async (filename, id) => {
    const browser = await puppeteer.launch({args: ['--no-sandbox']}); // launch a browser (chromium by default but you can chose another one)
    const page = await browser.newPage(); // open a page in the browser
    await page.goto(`https://cigarlift.work/order/${id}`, {
        waitUntil: "networkidle2",
    }); // visit the printable version of your page
    // wait for div? await page.waitForSelector("order-page")
    const pdf = await page.pdf({ format: "a4", path: `./orders/${filename}` }); // generate the PDF 🎉
    await browser.close();
    return pdf
}

// @desc Get all orders
// @route GET /orders
// @access Private
const getAllOrders = async (req, res) => {
    // Get all orders from MongoDB
    const orders = await Order.find().lean()

    // If no orders 
    if (!orders?.length) {
        return res.status(400).json({ message: 'No orders found' })
    }

    res.json(orders)
}

// @desc Get one order by id
// @route GET /orders/:id
// @access Private
const getOrderById = async (req, res) => {
    const id = req.params.id
    console.log(id)
    //const mongoID = new mongoose.Types.ObjectId(id)
    // Does the client exist?
    const order = await Order.findById(id).exec()

    if (!order) {
        return res.status(400).json({ message: 'Order not found' })
    }
    res.status(200).json(order)
}
    

// @desc Create new order
// @route POST /orders
// @access Private
const createNewOrder = async (req, res) => {
    const { client, cigars, cigarStrings, total, payed } = req.body

    // Confirm data
    if (!client || !cigars || !total) {
        return res.status(400).json({ error: 'Client, cigars, and total are required' })
    }

    let event = new Date()
    let time = event.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }).replaceAll(":",".").replaceAll("/","-")
    let filename = `Order ${time} ${client.dba}.pdf`

    const orderObject = { client, cigars, cigarStrings, total, payed, filename }

    // Create and store new order 
    const order = await Order.create(orderObject)

    // not created
    if (!order) {
        res.status(400).json({ error: 'Invalid order data received' })
        return
    }
    // created 
    res.status(201).json({ success: `New order created: ${filename}` })
    // generate PDF
    const pdf = await generatePDF(filename, order._id)
    sendEmail(order)
    // update Inventory
    let i = 0
    for (i; i<cigars.length; i++) {
        let c = cigars[i]
        const cigarObject = await Cigar.findById(c._id)
        if (cigarObject) {
            cigarObject.quantity = cigarObject.quantity - c.qty
            await Cigar.findByIdAndUpdate(cigarObject._id, cigarObject)
        }
    }
}

// @desc Update a order
// @route PATCH /orders
// @access Private
const updateOrder = async (req, res) => {
    const { _id } = req.body
    const updateData = req.body

    // Confirm data 
    /*if (!name || !price) {
        return res.status(400).json({ message: 'Name and price are required' })
    }*/

    // Does the order exist to update?
    const order = await Order.findById(_id).exec()

    if (!order) {
        return res.status(400).json({ message: 'order not found' })
    }
    
    Object.assign(order, updateData)

    const updatedOrder = await order.save()

    res.json(updatedOrder)
}

// @desc Delete a order
// @route DELETE /orders
// @access Private
const deleteOrder = async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Order ID Required' })
    }

    // Does the order still have assigned notes?
    /*const note = await Note.findOne({ order: id }).lean().exec()
    if (note) {
        return res.status(400).json({ message: 'Order has assigned notes' })
    }*/

    // Does the order exist to delete?
    const order = await Order.findById(id).exec()

    if (!order) {
        return res.status(400).json({ message: 'order not found' })
    }

    const result = await order.deleteOne()

    const reply = `Order ${result.name} with ID ${result._id} deleted`

    res.json(reply)
}

module.exports = {
    getAllOrders,
    getOrderById,
    createNewOrder,
    updateOrder,
    deleteOrder
}