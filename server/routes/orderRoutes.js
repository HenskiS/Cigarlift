const express = require('express')
const router = express.Router()
const ordersController = require('../controllers/ordersController')
const verifyJWT = require('../middleware/verifyJWT')

// print route is public (but only returns order data within 10 min of order being placed)
router.route('/print/:id')
    .get(ordersController.getPrintOrderById)

router.use(verifyJWT)

router.route('/')
    .get(ordersController.getAllOrders)
    .post(ordersController.createNewOrder)
    .patch(ordersController.updateOrder)
    .delete(ordersController.deleteOrder)
router.route('/:id')
    .get(ordersController.getOrderById)

module.exports = router