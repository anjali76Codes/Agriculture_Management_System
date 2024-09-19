const express = require('express');
const multer = require('multer');
const { uploadCrop, getAllCrops, getCropImage, deleteCrop } = require('../controllers/cropController');
const authMiddleware = require('../middleware/auth.middleware'); // Import your authentication middleware if needed

const router = express.Router();

// Multer setup for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Routes
router.post('/upload', upload.single('image'), uploadCrop);
router.get('/', getAllCrops); // Get all crops (now supports filtering by username)
router.get('/:id', getCropImage); // Get specific crop image
router.delete('/:id', deleteCrop); // Delete crop

module.exports = router;
