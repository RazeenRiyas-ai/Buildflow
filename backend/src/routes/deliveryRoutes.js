const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/deliveryController');
const { authMiddleware, roleGuard } = require('../middlewares/auth');

router.use(authMiddleware);

// Get open jobs (Delivery partners only)
router.get('/available', roleGuard(['DELIVERY']), deliveryController.getAvailableDeliveries);

// Get my jobs
router.get('/my-jobs', roleGuard(['DELIVERY']), deliveryController.getMyDeliveries);

// Accept a job
router.post('/:id/accept', roleGuard(['DELIVERY']), deliveryController.acceptDelivery);

// Update status
router.patch('/:id/status', roleGuard(['DELIVERY']), deliveryController.updateDeliveryStatus);

module.exports = router;
