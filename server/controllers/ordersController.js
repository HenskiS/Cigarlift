const { default: mongoose } = require('mongoose')
const Order = require('../models/Order')
const puppeteer = require("puppeteer");
const emailHandler = require('../middleware/emailHandler');
const Cigar = require('../models/Cigar');
const Client = require('../models/Client');

const generatePDF = async (filename, id) => {
    const browser = await puppeteer.launch({args: ['--no-sandbox']}); // launch a browser (chromium by default but you can chose another one)
    const page = await browser.newPage(); // open a page in the browser
    await page.goto(`http://localhost:5173/order/print/${id}`, {
    //await page.goto(`https://cigarlift.work/order/print/${id}`, {
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

// @desc Get one order by id
// @route GET /orders/print/:id
// @access Public
const getPrintOrderById = async (req, res) => {
    const id = req.params.id
    console.log(id)
    
    const order = await Order.findById(id).exec()

    if (!order) {
        return res.status(400).json({ message: 'Order not found' })
    }

    const now = Date.now()
    const diff = now - order.date
    const minutes = Math.floor((diff/1000)/60);
    if (minutes < 10) {
        res.status(200).json(order)
    } else {
        res.status(400).json({ message: 'Unauthorized: Order Timeout (10 minutes from submission)' })
    }
}
    

// @desc Create new order
// @route POST /orders
// @access Private
const createNewOrder = async (req, res) => {
    const { client, cigars, total, payed, isTestOrder } = req.body

    // Confirm data
    if (!client || !cigars || !total) {
        return res.status(400).json({ error: 'Client, cigars, and total are required' })
    }

    let event = new Date()
    let time = event.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }).replaceAll(":",".").replaceAll("/","-")
    let filename = `Order ${time} ${client.dba}.pdf`
    
    let invoiceNum;
    try {
        invoiceNum = isTestOrder ? -1 : client.orders + 1;
    } catch (error) {
        console.error('Error generating invoice number:', error.message);
        invoiceNum = -1;
    }

    const orderObject = { client, cigars, total, payed, filename, isTestOrder, invoiceNum }

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
    emailHandler.sendEmail(order)

    // update Inventory (if not test order)
    if (!isTestOrder) {
        try {
            for (const c of cigars) {
                await Cigar.findByIdAndUpdate(
                    c._id,
                    { $inc: { quantity: -c.qty } },
                    { new: true }
                );
            }
            // Update client's order count
            await Client.findByIdAndUpdate(
                client._id,
                { $inc: { orders: 1 } },
                { new: true }
            );
        } catch (error) {
            console.error('Error updating inventory:', error);
            throw error;
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

// @desc Get all unique clients who have placed orders
// @route GET /orders/clients
// @access Private
const getOrderedClients = async (req, res) => {
    try {
        // Aggregate to get unique clients from orders
        const orderedClients = await Order.aggregate([
            { $match: {
                $or: [
                    { isTestOrder: { $exists: false } },
                    { isTestOrder: false }
                ]
            }},
            { $group: {
                _id: "$client._id",
                clientData: { $first: "$client" },
                orderCount: { $sum: 1 },
                lastOrderDate: { $max: "$date" }
            }},
            { $project: {
                _id: 0,
                client: "$clientData",
                orderCount: 1,
                lastOrderDate: 1
            }}
        ]);

        /* if (!orderedClients.length) {
            return res.status(404).json({ message: 'No clients with orders found' });
        } */

        res.json(orderedClients);
    } catch (error) {
        console.error('Error fetching ordered clients:', error);
        res.status(500).json({ message: 'Server error while fetching ordered clients' });
    }
}

module.exports = {
    getAllOrders,
    getOrderById,
    getPrintOrderById,
    createNewOrder,
    updateOrder,
    deleteOrder,
    getOrderedClients
}