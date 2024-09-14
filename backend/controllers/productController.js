const Product = require('../models/Product');

// Add a product
exports.createProduct = async (req, res) => {
    try {
        const { userId, name, description, price, type, location, images } = req.body;

        const newProduct = new Product({
            userId, // Set the user ID
            name,
            description,
            price,
            type,
            images,
            location
        });

        await newProduct.save();
        res.status(201).json({ message: 'Product added successfully!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Retrieve products
exports.getProducts = async (req, res) => {
    try {
        const { userId } = req.query; // Get userId from query parameters
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const products = await Product.find({ userId });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

