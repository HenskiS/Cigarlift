const { default: mongoose } = require('mongoose')
const Order = require('../models/Order')

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

    // Check for duplicate username
    /*const duplicate = await Order.findOne({ username }).collation({ locale: 'en', strength: 2 }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate username' })
    }*/
    let filename = "file"

    const orderObject = { client, cigars, cigarStrings, total, payed, filename }

    // Create and store new order 
    const order = await Order.create(orderObject)

    if (order) { //created 
        res.status(201).json({ success: `New order created: ${filename}` })
    } else {
        res.status(400).json({ error: 'Invalid order data received' })
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