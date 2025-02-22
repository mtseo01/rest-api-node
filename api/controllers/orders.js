const Order = require('../models/order');
const Product = require('../models/product');
const mongoose = require('mongoose');

exports.getOrdersAll = (req, res, next) => {
  Order.find()
    .select('product quantity _id')
    .populate('product', 'name price')
    .exec()
    .then((docs) => {
      res.status(200).json({
        count: docs.length,
        orders: docs.map((doc) => {
          return {
            _id: doc._id,
            product: doc.product,
            quantity: doc.quantity,
            request: {
              type: 'GET',
              url: 'http://localhost:3000/orders/' + doc._id,
            },
          };
        }),
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.createOrders = (req, res, next) => {
  Product.findById(req.body.productId)
    .then((product) => {
      if (!product) {
        return res.status(404).json({
          message: 'Product not found',
        });
      } else {
        const order = new Order({
          _id: mongoose.Types.ObjectId(),
          quantity: req.body.quantity,
          product: req.body.productId,
        });

        return order.save();
      }
    })
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: 'Order stored',
        createdOrder: {
          _id: result._id,
          product: result.product,
          quantity: result.quantity,
        },
        request: {
          type: 'GET',
          url: 'http://localhost:3000/orders/' + result._id,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.getOrderInfo = (req, res, next) => {
  Order.findById(req.params.orderId)
    .populate('product', 'name price')
    .exec()
    .then((order) => {
      // if (!order) {
      //   res.status(404).json({
      //     message: 'Order not found',
      //   });
      // }
      res.status(200).json({
        order: order,
        request: {
          type: 'GET',
          url: 'http://localhost:3000/orders',
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.deleteOrder = (req, res, next) => {
  const id = req.params.orderId;
  Order.deleteOne({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: 'Order deleted',
        orderId: result._id,
        product: result.product,
        request: {
          type: 'POST',
          url: 'http://localhost:3000/orders',
          body: { productId: 'ID', quantity: 'Number' },
        },
      });
    })
    .catch((err) => {
      res.status(500).jons({
        error: err,
      });
    });
};
