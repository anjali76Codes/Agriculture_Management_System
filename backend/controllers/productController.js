const Product = require('../models/Product');

// Add a product
exports.createProduct = async (req, res) => {
    try {
        const { username, name, description, price, type, location, images } = req.body;

        const newProduct = new Product({
            username, // Save the username
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

// Retrieve products based on username or all products
exports.getProducts = async (req, res) => {
    try {
        const { username } = req.query; // Extract username from query params

        // If username is provided, filter products by username
        const query = username ? { username } : {};
        const products = await Product.find(query);

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
