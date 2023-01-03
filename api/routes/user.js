const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

router.post('/signup', (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        res.status(409).json({
          message: 'email exists',
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({ error: err });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
            });
            user
              .save()
              .then((result) => {
                console.log(result);
                res.status(201).json({ message: 'User created' });
              })
              .catch((err) => {
                console.log(err);
                res.status(500).json({ error: err });
              });
          }
        });
      }
    });
});

router.post('/login', (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(404).json({
          message: "email not found, user doesn't exist",
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({ message: 'Auth failed' });
        } else if (result) {
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id,
            },
            process.env.JWT_KEY,
            {
              expiresIn: '1h',
            }
          );
          return res.status(200).json({ message: 'Auth successful', token });
        } else {
          res.status(401).json({ message: 'Auth failed' });
        }
      });
    })
    .catch((err) => res.status(500).json({ error: err }));
});

router.get('/', (req, res, next) => {
  User.find()
    .select('_id email password')
    .exec()
    .then((docs) => {
      res.status(200).json({
        count: docs.length,
        users: docs.map((doc) => {
          return {
            _id: doc._id,
            email: doc.email,
            password: doc.password,
            request: {
              type: 'GET',
              url: 'http://localhost:3000/user/' + doc._id,
            },
          };
        }),
      });
    })
    .catch((err) => res.status(500).json({ error: err }));
});

router.get('/:userId', (req, res, next) => {
  User.findById({ _id: req.params.userId })
    .exec()
    .then((user) => {
      res.status(200).json({
        user,
        request: {
          type: 'GET',
          url: 'http://localhost:3000/user',
        },
      });
    })
    .catch((err) => res.status(500).json({ error: err }));
});

router.delete('/:userId', (req, res, next) => {
  User.deleteOne({ _id: req.params.userId })
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: 'User deleted',
      });
    })
    .catch((err) => res.status(500).json({ error: err }));
});

module.exports = router;
