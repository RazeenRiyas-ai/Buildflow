const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authMiddleware, roleGuard } = require('../middlewares/auth');

router.use(authMiddleware); // All order routes require auth

router.get('/', orderController.getOrders);
router.post('/', roleGuard(['CUSTOMER']), orderController.createOrder); // Only customers place orders
router.patch('/:id/status', roleGuard(['SUPPLIER', 'ADMIN', 'CUSTOMER']), orderController.updateOrderStatus);

module.exports = router;
