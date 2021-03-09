const express = require('express');
const UsersController = require('../controllers/UsersController');
const apiAuth = require('../../../infra/middlewares/auth/api');
const userAuth = require('../../../infra/middlewares/auth/user');

const usersController = new UsersController();
const usersRoutes = express.Router();

usersRoutes.use(apiAuth);

usersRoutes.post('/', usersController.createUser);
usersRoutes.post('/activate', usersController.activateUser);

usersRoutes.use(userAuth);

module.exports = usersRoutes;
