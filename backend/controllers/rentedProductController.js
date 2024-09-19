const express = require('express');
const router = express.Router();
const RentedProduct = require('../models/rentedProduct');

// Create rented product
router.post('/', async (req, res) => {
    try {
        const { username, email, product, paymentId } = req.body;

        if (!username || !email || !product || !paymentId) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const newRentedProduct = new RentedProduct({
            _id: new mongoose.Types.ObjectId(),
            username,
            email,
            product,
            paymentId
        });

        const result = await newRentedProduct.save();

        res.status(201).json({
            message: 'Rented product successfully created',
            rentedProduct: result
        });
    } catch (error) {
        console.error('Error creating rented product:', error);
        res.status(500).json({
            message: 'Failed to create rented product',
            error: error.message
        });
    }
});




module.exports = router;
