const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const ProductsController = require('../controllers/products');

router.get('/', ProductsController.getProductsAll);

router.post('/', checkAuth, ProductsController.createProduct);

router.get('/:productId', ProductsController.getProductInfo);

router.patch('/:productId', checkAuth, ProductsController.updateProduct);

router.delete('/:productId', checkAuth, ProductsController.deleteProduct);

module.exports = router;
