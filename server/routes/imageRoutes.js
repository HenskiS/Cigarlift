const express = require('express')
const router = express.Router()
const itinerariesController = require('../controllers/itinerariesController')
const verifyJWT = require('../middleware/verifyJWT')
const path = require('path');
const fs = require('fs');

const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './images');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});
const upload = multer({ storage });

router.use(verifyJWT)

router.get("/", async (req, res) => {
    const imageToBase64 = require('image-to-base64')
    const imagePath = path.join(__dirname, '../images', 'placeholder.jpg')
    if (fs.existsSync(imagePath)) {
        imageToBase64(imagePath).then(response => res.send(response))
    }
});
router.get("/:imageName", async (req, res) => {
    const imageToBase64 = require('image-to-base64')
    const imageName = req.params.imageName
    const imagePath = path.join(__dirname, '../images', imageName)
    if (fs.existsSync(imagePath)) {
        imageToBase64(imagePath).then(response => res.send(response))
    } 
    else {
        console.log("couldn't find that image at path:")
        console.log(imagePath)
        res.status(404).send('Image not found');
    }
});
router.post("/", upload.single('file'), (req, res) => {
    res.json(req.file)
});
router.patch("/", async (req, res) => {
    
});
router.delete("/", async (req, res) => {
    
});


module.exports = router