const express = require('express')
const router = express.Router()
const reportsController = require('../controllers/reportsController')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router.route('/')
    .get(reportsController.getAllReports)
    .post(reportsController.createNewReport)
router.route('/:id')
    .get(reportsController.getReportById)

module.exports = router