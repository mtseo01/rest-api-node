const express = require('express');
const app = express();
const productRouter = require('./api/routes/products');
const ordersRouter = require('./api/routes/orders');
const morgan = require('morgan');

app.use(morgan('dev'));

// Routes which should handle requests
app.use('/products', productRouter);
app.use('/orders', ordersRouter);

app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
