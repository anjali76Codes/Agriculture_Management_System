const express = require('express');
const productController = require('../controllers/productController');

const router = express.Router();

router.post('/products', productController.createProduct);
router.get('/products', productController.getProducts); // This will handle both cases

module.exports = router;
