const express = require('express');
const authController = require('../controllers/authController');
const buildingController = require('../controllers/buildingController');
const patientController = require('../controllers/patientController');
const userController = require('../controllers/userController');
const {
    requireLogin
} = require('../middleware/authMiddleware');
const routes = express.Router();

routes.get('/getAuth', authController.getAllAuth);
routes.get('/getBuild', buildingController.getAllBuild);
routes.get('/getPatient', patientController.getAllPatient);
routes.get('/getDashboard', patientController.dashboard);

routes.post('/register', authController.register);
routes.post('/getAuthByUser', authController.getAuthByUsername);
routes.post('/login',authController.login);
routes.post('/logout', requireLogin, authController.logout);
routes.post('/addBuilding', buildingController.addBuilding);
routes.post('/addPatient', patientController.addPatient);
routes.post('/isUserSick', userController.isUserSick);
routes.post('/userGetWell', patientController.userGetWell);
routes.post('/updatePatientLocation', patientController.updatePatientLocation);
routes.post('/getProfile', userController.getProfile);
routes.post('/updateProfile', userController.updateProfile);
routes.post('/deleteAccount', authController.deleteAccount);

module.exports = routes;