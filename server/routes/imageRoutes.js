const express = require('express');
const router = express.Router();
const itinerariesController = require('../controllers/itinerariesController');
const verifyJWT = require('../middleware/verifyJWT');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const multer = require('multer');

// Disable all automatic rotation in Sharp
sharp.cache(false);

// Use memory storage for compression
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

const compressImage = async (buffer, targetSizeMB = 2) => {
    const targetSize = targetSizeMB * 1024 * 1024;
    
    if (buffer.length <= targetSize) {
        return buffer;
    }

    const metadata = await sharp(buffer).metadata();

    try {
        // Create base pipeline with ALL rotation disabled
        const pipeline = sharp(buffer, {
            failOnError: false,
            animated: false,
            rotate: false,
            limitInputPixels: false
        }).withMetadata({
            orientation: 1  // Force orientation to normal
        });

        // Size-based quality setting
        const sizeMB = buffer.length / (1024 * 1024);
        const quality = sizeMB > 5 ? 60 : 75;

        if (metadata.format === 'png' && metadata.hasAlpha) {
            return await pipeline
                .withMetadata({ orientation: 1 })
                .png({
                    quality,
                    compressionLevel: 9
                })
                .toBuffer();
        } else {
            return await pipeline
                .withMetadata({ orientation: 1 })
                .jpeg({
                    quality,
                    chromaSubsampling: '4:4:4'
                })
                .toBuffer();
        }
    } catch (error) {
        console.error('Compression error:', error);
        return buffer;
    }
};

router.use(verifyJWT);

router.get("/", async (req, res) => {
    const imageToBase64 = require('image-to-base64');
    const imagePath = path.join(__dirname, '../images', 'placeholder.jpg');
    if (fs.existsSync(imagePath)) {
        imageToBase64(imagePath).then(response => res.send(response));
    }
});

router.get("/:imageName", async (req, res) => {
    const imageToBase64 = require('image-to-base64');
    const imageName = req.params.imageName;
    const imagePath = path.join(__dirname, '../images', imageName);
    if (fs.existsSync(imagePath)) {
        imageToBase64(imagePath).then(response => res.send(response));
    } else {
        console.log("couldn't find that image at path:");
        console.log(imagePath);
        res.status(404).send('Image not found');
    }
});

router.post("/", upload.single('file'), async (req, res) => {
    if (!req.file) {
        console.log('No file received in upload request');
        return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
        const startTime = Date.now();
        
        const extension = path.extname(req.file.originalname);
        const newExtension = extension.toLowerCase() === '.png' ? '.png' : '.jpg';
        const filename = path.basename(req.file.originalname, extension) + newExtension;
        
        const compressedBuffer = await compressImage(req.file.buffer, 2);
        
        const savePath = path.join(__dirname, '../images', filename);
        await fs.promises.writeFile(savePath, compressedBuffer);

        const endTime = Date.now();
        
        console.log('File processed and saved:', {
            originalName: req.file.originalname,
            savedAs: filename,
            originalSize: `${(req.file.size / 1024 / 1024).toFixed(2)}MB`,
            compressedSize: `${(compressedBuffer.length / 1024 / 1024).toFixed(2)}MB`,
            compressionRatio: `${((compressedBuffer.length / req.file.size) * 100).toFixed(1)}%`,
            processingTime: `${endTime - startTime}ms`,
            destination: savePath
        });

        res.json({
            originalname: filename,
            filename: filename,
            size: compressedBuffer.length,
            path: savePath
        });
    } catch (error) {
        console.error('Error processing image:', error);
        res.status(500).json({ message: 'Error processing image' });
    }
});

router.patch("/", async (req, res) => {
    
});

router.delete("/", async (req, res) => {
    
});

module.exports = router;