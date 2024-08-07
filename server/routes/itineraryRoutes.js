const express = require('express')
const router = express.Router()
const itinerariesController = require('../controllers/itinerariesController')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router.route('/')
    .post(itinerariesController.createNewItinerary)
    .patch(itinerariesController.updateItinerary)
    .delete(itinerariesController.deleteItinerary)
router.route('/getByDate')
    .post(itinerariesController.getItinerary)
router.route('/images/:imageName')
    .get(itinerariesController.getImage)
router.route('/:id')
    .post(itinerariesController.addStops)

module.exports = router