const express = require('express');
const router = express.Router();
const itinerariesController = require('../controllers/itinerariesController');
const verifyJWT = require('../middleware/verifyJWT');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const multer = require('multer');

// Use memory storage temporarily for compression
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

const compressImage = async (buffer, targetSizeMB = 2) => {
    const targetSize = targetSizeMB * 1024 * 1024; // Convert to bytes
    
    // If image is already smaller than target, return as is
    if (buffer.length <= targetSize) {
        return buffer;
    }

    const metadata = await sharp(buffer).metadata();

    // Function to attempt compression with given quality
    const attemptCompress = async (quality) => {
        const pipeline = sharp(buffer);

        if (metadata.format === 'png' && metadata.hasAlpha) {
            return pipeline
                .png({
                    quality,
                    compressionLevel: 9
                })
                .toBuffer();
        } else {
            return pipeline
                .jpeg({
                    quality,
                    mozjpeg: true
                })
                .toBuffer();
        }
    };

    // Binary search for optimal quality
    let minQuality = 20; // Don't go below 20% quality
    let maxQuality = 100;
    let bestResult = null;
    let attempts = 0;
    const maxAttempts = 8;

    while (attempts < maxAttempts) {
        const quality = Math.round((minQuality + maxQuality) / 2);
        const compressed = await attemptCompress(quality);
        
        if (!bestResult || (compressed.length <= targetSize && quality > bestResult.quality)) {
            bestResult = {
                buffer: compressed,
                quality,
                size: compressed.length
            };
        }

        if (Math.abs(compressed.length - targetSize) < targetSize * 0.05 || 
            Math.abs(maxQuality - minQuality) < 5) {
            break;
        }

        if (compressed.length > targetSize) {
            maxQuality = quality;
        } else {
            minQuality = quality;
        }
        
        attempts++;
    }

    return bestResult ? bestResult.buffer : buffer;
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
        // Get file extension
        const extension = path.extname(req.file.originalname);
        const newExtension = extension.toLowerCase() === '.png' ? '.png' : '.jpg';
        const filename = path.basename(req.file.originalname, extension) + newExtension;
        
        // Compress the image to target 2MB
        const compressedBuffer = await compressImage(req.file.buffer, 2);
        
        // Save the compressed image
        const savePath = path.join(__dirname, '../images', filename);
        await fs.promises.writeFile(savePath, compressedBuffer);

        // Log the results
        console.log('File processed and saved:', {
            originalName: req.file.originalname,
            savedAs: filename,
            originalSize: `${(req.file.size / 1024 / 1024).toFixed(2)}MB`,
            compressedSize: `${(compressedBuffer.length / 1024 / 1024).toFixed(2)}MB`,
            compressionRatio: `${((compressedBuffer.length / req.file.size) * 100).toFixed(1)}%`,
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