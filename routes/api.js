const express = require('express');
const authController = require('../controllers/authController');
const routes = express.Router();

routes.post('/register', authController.register);
routes.get('/getAuth', authController.getAllAuth);
routes.post('/getAuthByUser', authController.getAuthByUsername);
routes.post('/login', authController.login);

module.exports = routes;