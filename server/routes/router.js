const express = require('express');
const route = express.Router();
const services = require('../services/render'); // services for accessing API endpoints
const controller = require('../controller/controller'); // to fetch data from backend
const { ensureAuthenticated } = require('../../config/auth');

// Welcome Page
route.get('/', (req, res) => res.render('welcome'));

// Login Page
route.get('/login', services.login);

// Register Page
route.get('/register', services.register);

/*
    @description Home route
    @method GET/
*/
route.get('/user', ensureAuthenticated, controller.home);

/* 
    @description Add User
    @method GET/add-user
*/
route.get('/add-user', ensureAuthenticated, services.add_user);

/* 
    @description Update User
    @method GET/update-user
*/
route.get('/update-user/:id', ensureAuthenticated, services.update_user);

// Register Handle
route.post('/register', controller.registerHandle);

// Log-in Handle
route.post('/login', controller.loginHandle);

// Logout Handle
route.post('/logout', ensureAuthenticated, controller.logout);

route.post('/add-user', ensureAuthenticated, controller.create);
route.post('/update-user/:id', ensureAuthenticated, controller.update);
route.get('/delete/:id', ensureAuthenticated, controller.delete);

module.exports = route;