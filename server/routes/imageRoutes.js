const express = require('express');
const router = express.Router();
const itinerariesController = require('../controllers/itinerariesController');
const verifyJWT = require('../middleware/verifyJWT');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const multer = require('multer');

// Use memory storage for compression
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

const compressImage = async (buffer, targetSizeMB = 2) => {
    const targetSize = targetSizeMB * 1024 * 1024;
    
    // If image is already smaller than target, return as is
    if (buffer.length <= targetSize) {
        return buffer;
    }

    // Get metadata to check format
    const metadata = await sharp(buffer).metadata();

    // Create a pipeline that preserves orientation
    const pipeline = sharp(buffer, {
        failOnError: false, // Don't fail on corrupted images
        rotate: false      // Don't auto-rotate based on EXIF
    });

    // If it's significantly over target size, we'll do a more aggressive compression
    const sizeMB = buffer.length / (1024 * 1024);
    const quality = sizeMB > 5 ? 60 : 75;  // More aggressive for very large files

    try {
        if (metadata.format === 'png' && metadata.hasAlpha) {
            // For PNGs with transparency, use PNG compression
            return await pipeline
                .png({
                    quality,
                    compressionLevel: 9
                })
                .toBuffer();
        } else {
            // For all other images, convert to JPEG
            // Not using mozjpeg for speed
            return await pipeline
                .jpeg({
                    quality,
                    chromaSubsampling: '4:4:4' // Better quality for text
                })
                .toBuffer();
        }
    } catch (error) {
        console.error('Compression error:', error);
        return buffer; // Return original if compression fails
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
        
        // Get file extension
        const extension = path.extname(req.file.originalname);
        const newExtension = extension.toLowerCase() === '.png' ? '.png' : '.jpg';
        const filename = path.basename(req.file.originalname, extension) + newExtension;
        
        // Compress the image
        const compressedBuffer = await compressImage(req.file.buffer, 2);
        
        // Save the compressed image
        const savePath = path.join(__dirname, '../images', filename);
        await fs.promises.writeFile(savePath, compressedBuffer);

        const endTime = Date.now();
        
        // Log the results
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