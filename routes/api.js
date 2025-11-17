const express = require('express');
const authController = require('../controllers/authController');
const {
    requireLogin
} = require('../middleware/authMiddleware');
const routes = express.Router();

routes.post('/register', authController.register);
routes.get('/getAuth', authController.getAllAuth);
routes.post('/getAuthByUser', authController.getAuthByUsername);
routes.post('/login', authController.login);
routes.post('/logout', authController.logout)

module.exports = routes;