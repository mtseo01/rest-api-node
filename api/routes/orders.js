const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const OrdersController = require('../controllers/orders');

router.get('/', checkAuth, OrdersController.getOrdersAll);

router.post('/', checkAuth, OrdersController.createOrders);

router.get('/:orderId', checkAuth, OrdersController.getOrderInfo);

router.delete('/:orderId', checkAuth, OrdersController.deleteOrder);

module.exports = router;
