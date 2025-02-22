const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const UserController = require('../controllers/user');

router.post('/signup', UserController.signUp);

router.post('/signin', UserController.signIn);

router.get('/', checkAuth, UserController.getUsersAll);

router.get('/:userId', checkAuth, UserController.getUserInfo);

router.delete('/:userId', checkAuth, UserController.deleteUser);

module.exports = router;
