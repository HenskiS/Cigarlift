const express = require('express')
const router = express.Router()
const appointmentsController = require('../controllers/appointmentsController')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router.route('/')
    .get(appointmentsController.getAllAppointments)
    .post(appointmentsController.createNewAppointment)
    .patch(appointmentsController.updateAppointment)
    .delete(appointmentsController.deleteAppointment)
router.route('/upcoming')
    .get(appointmentsController.getUpcomingAppointment)
router.route('/:id')
    .get(appointmentsController.getAppointmentById)


module.exports = router