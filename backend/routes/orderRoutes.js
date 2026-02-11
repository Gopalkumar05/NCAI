const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const orderController = require('../controllers/orderController');

router.route('/')
  .post(protect, orderController.createOrder)
  .get(protect, orderController.getMyOrders)
   .post(protect, orderController.cancelOrder);

router.get('/history', protect, orderController.getOrderHistory);
router.get('/:id', protect, orderController.getOrderById);
router.put('/:id/pay', protect, orderController.updateOrderToPaid);
router.put('/:id/cancel', protect, orderController.cancelOrder);

module.exports = router;