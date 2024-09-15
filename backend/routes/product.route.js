const express = require('express');
const productController = require('../controllers/productController');

const router = express.Router();

// Route to create a product
router.post('/products', productController.createProduct);

// Route to get all products or products by username
router.get('/products', productController.getProducts);

// Route to get a product by ID
router.get('/products/:id', productController.getProductById);

// Route to add a review to a product
router.post('/products/:id/reviews', productController.addReview);

// In your routes file (e.g., productRoutes.js)

router.get('/sales-metrics', productController.getSalesMetrics);


module.exports = router;
