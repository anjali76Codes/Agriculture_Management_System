// models/rentedProduct.js

const mongoose = require('mongoose');

const rentedProductSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: { type: String, required: true },
    email: { type: String, required: true },
    product: {
        _id: mongoose.Schema.Types.ObjectId,
        username: String,
        name: String,
        description: String,
        images: [String],
        location: String,
        price: Number,
        depositAmount: Number,
        rentalDuration: String,
        condition: String,
        available: Boolean,
        contactInfo: String,
        availabilityDates: [Date],
        tags: [String],
        type: String,
        createdAt: Date,
        updatedAt: Date,
    },
    paymentId: { type: String, required: true },
    rentedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('RentedProduct', rentedProductSchema);
