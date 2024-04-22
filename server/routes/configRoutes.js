const express = require('express')
const router = express.Router()
const configController = require('../controllers/configController')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router.route('/')
    .get(configController.getConfig)
    .patch(configController.updateConfig)

module.exports = router