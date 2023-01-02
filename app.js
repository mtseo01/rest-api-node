const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRouter = require('./api/routes/products');
const ordersRouter = require('./api/routes/orders');
const userRouter = require('./api/routes/user');

mongoose.set('strictQuery', true);
mongoose.connect(
  `mongodb+srv://mtseo:${process.env.DB_PWD}@cluster0.nxorzkg.mongodb.net/?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
  }
);

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes which should handle requests
app.use('/products', productRouter);
app.use('/orders', ordersRouter);
app.use('/user', userRouter);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, PUT');
    return res.status(200).json({});
  }
  next();
});

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
