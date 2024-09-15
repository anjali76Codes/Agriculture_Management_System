const Product = require('../models/Product');

// Create a product
exports.createProduct = async (req, res) => {
    try {
        const { username, name, description, price, type, location, images, rentalDuration, available, depositAmount, condition, contactInfo } = req.body;

        // Validate required fields
        if (!username || !name || !description || !price || !type || !location) {
            return res.status(400).json({ error: 'Required fields are missing.' });
        }

        // Create a new product instance
        const newProduct = new Product({
            username,
            name,
            description,
            price,
            type,
            images,
            location,
            rentalDuration,
            available,
            depositAmount,
            condition,
            contactInfo
        });

        // Save the new product to the database
        await newProduct.save();
        res.status(201).json({ message: 'Product added successfully!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Retrieve products based on username or all products
exports.getProducts = async (req, res) => {
    try {
        const { username, type, location, minPrice, maxPrice, condition } = req.query;

        // Build query object based on optional filters
        const query = {};
        if (username) query.username = username;
        if (type) query.type = type;
        if (location) query.location = location;
        if (minPrice) query.price = { ...query.price, $gte: minPrice };
        if (maxPrice) query.price = { ...query.price, $lte: maxPrice };
        if (condition) query.condition = condition;

        // Retrieve products matching the query
        const products = await Product.find(query);

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Retrieve a product by its ID
exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params; // Extract product ID from route params

        // Find the product by ID
        const product = await Product.findById(id);

        // Handle case where product is not found
        if (!product) {
            return res.status(404).json({ error: 'Product not found.' });
        }

        // Return the product details
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Add a review to a product
exports.addReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, comment, username } = req.body;

        // Validate required fields
        if (!rating || !comment || !username) {
            return res.status(400).json({ error: 'Required fields are missing.' });
        }

        // Find the product and update with new review
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found.' });
        }

        product.reviews.push({ rating, comment, username });
        await product.save();

        res.status(201).json(product.reviews[product.reviews.length - 1]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


