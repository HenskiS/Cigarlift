const express = require('express')
const router = express.Router()
const cigarsController = require('../controllers/cigarsController')
const verifyJWT = require('../middleware/verifyJWT')

//router.use(verifyJWT)

router.route('/')
    .get(cigarsController.getAllCigars)
    .post(cigarsController.createNewCigar)
    .patch(cigarsController.updateCigar)
    .delete(cigarsController.deleteCigar)

module.exports = router