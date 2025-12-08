const express = require('express');
const authController = require('../controllers/authController');
const buildingController = require('../controllers/buildingController');
const {
    requireLogin
} = require('../middleware/authMiddleware');
const routes = express.Router();

routes.get('/getAuth', authController.getAllAuth);
routes.get('/getBuild', buildingController.getAllBuild);

routes.post('/register', authController.register);
routes.post('/getAuthByUser', authController.getAuthByUsername);
routes.post('/login', authController.login);
routes.post('/logout', authController.logout);
routes.post('/addBuilding', buildingController.addBuilding);

module.exports = routes;