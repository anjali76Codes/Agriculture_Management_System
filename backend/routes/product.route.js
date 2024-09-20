const express = require('express');
const productController = require('../controllers/productController');

const router = express.Router();

// Create a new product
router.post('/products', productController.createProduct);

// Retrieve all products or filter by query parameters
router.get('/products', productController.getProducts);

// Retrieve a specific product by its ID
router.get('/products/:id', productController.getProductById);

// Add a review to a specific product
router.post('/products/:id/reviews', productController.addReview);

// Get sales metrics for a specific username
router.get('/sales-metrics', productController.getSalesMetrics);

// Update product availability (mark as unavailable)
router.patch('/products/:id/availability', productController.updateProductAvailability);

// Update product details (including availability)
router.patch('/products/:id', productController.updateProduct);

// Delete a product by its ID
router.delete('/products/:id', productController.deleteProduct);

module.exports = router;
