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
    
    if (buffer.length <= targetSize) {
        return buffer;
    }

    try {
        // Get metadata first
        let image = sharp(buffer, { failOnError: false });
        const metadata = await image.metadata();
        
        // Calculate current size in MB
        const sizeMB = buffer.length / (1024 * 1024);
        
        // Create new pipeline with proper metadata handling
        image = sharp(buffer, { failOnError: false })
            .rotate()
            .withMetadata(false);  // This removes EXIF data

        // If image is very large, resize while maintaining aspect ratio
        if (metadata.width > 4000 || metadata.height > 4000) {
            image = image.resize(4000, 4000, {
                fit: 'inside',
                withoutEnlargement: true
            });
        }

        // Maintain original format but with optimized compression
        const quality = Math.min(80, Math.max(50, Math.floor(100 - (sizeMB * 8))));

        if (metadata.format === 'png') {
            return await image
                .png({
                    compressionLevel: 9,
                    effort: 10,
                    quality
                })
                .toBuffer();
        } else if (metadata.format === 'jpeg' || metadata.format === 'jpg') {
            return await image
                .jpeg({
                    quality,
                    chromaSubsampling: '4:2:0',
                    mozjpeg: true
                })
                .toBuffer();
        } else if (metadata.format === 'webp') {
            return await image
                .webp({
                    quality,
                    effort: 6
                })
                .toBuffer();
        } else {
            // For any other format, maintain original format
            return await image.toBuffer();
        }
    } catch (error) {
        console.error('Compression error:', error);
        return buffer;
    }
};

// Rest of your routes remain the same
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