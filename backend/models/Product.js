const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    username: { type: String, required: true }, // Owner's username
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true }, // Rental price per unit time (e.g., per day, week)
    type: { type: String, enum: ['selling', 'renting'], required: true },
    images: [String], // Array of image URLs
    location: { type: String, required: true },
    rentalDuration: { type: String }, // Duration for which the product is available for rent (e.g., '1 week')
    available: { type: Boolean, default: true }, // Availability status
    category: { type: String }, // Optional: Category of the product (e.g., 'Tractors', 'Tools')
    tags: [String], // Optional: Tags for filtering (e.g., ['Heavy-Duty', 'New'])
    depositAmount: { type: Number }, // Optional: Security deposit required for renting
    rentalTerms: { type: String }, // Optional: Terms and conditions for rental
    reviews: [{
        username: { type: String }, // Username of the reviewer
        rating: { type: Number, min: 1, max: 5 }, // Rating out of 5
        comment: { type: String }, // Review comment
        date: { type: Date, default: Date.now } // Date of the review
    }],
    availabilityDates: [{
        startDate: { type: Date },
        endDate: { type: Date }
    }], // Optional: List of date ranges when the product is available
    condition: { type: String }, // Optional: Condition of the product (e.g., 'New', 'Used')
    contactInfo: {
        phone: { type: String }, // Optional: Phone number of the product owner
        email: { type: String } // Optional: Email of the product owner
    }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
