const express = require('express');
const router = express.Router();
const RentedProduct = require('../models/rentedProduct');
const mongoose = require('mongoose');

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

// Get all rented products for a specific email
router.get('/', async (req, res) => {
    try {
        const { email } = req.query;

        if (!email) {
            return res.status(400).json({ message: 'Email query parameter is required' });
        }

        const rentedProducts = await RentedProduct.find({ email }).populate('product');

        if (rentedProducts.length === 0) {
            return res.status(404).json({ message: 'No rented products found for this email' });
        }

        res.status(200).json(rentedProducts);
    } catch (error) {
        console.error('Error fetching rented products:', error);
        res.status(500).json({
            message: 'Failed to fetch rented products',
            error: error.message
        });
    }
});

module.exports = router;
