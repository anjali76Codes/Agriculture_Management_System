const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    username: { type: String, required: true }, // Include username
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    type: { type: String, enum: ['selling', 'renting'], required: true },
    images: [String],
    location: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
