const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authMiddleware, roleGuard } = require('../middlewares/auth');

// Public read access
router.get('/', productController.getProducts);

// Supplier write access
router.post('/', authMiddleware, roleGuard(['SUPPLIER', 'ADMIN']), productController.createProduct);
router.patch('/:id', authMiddleware, roleGuard(['SUPPLIER', 'ADMIN']), productController.updateProduct);

module.exports = router;
