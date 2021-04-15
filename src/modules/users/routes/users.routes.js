const express = require('express');
const UsersController = require('../controllers/UsersController');
const apiAuth = require('../../../infra/middlewares/auth/api');
const userAuth = require('../../../infra/middlewares/auth/user');
const multer = require('multer');
const multerConfig = require('../../../shared/config/multer');

const usersController = new UsersController();
const usersRoutes = express.Router();

usersRoutes.use(apiAuth);

usersRoutes.post('/', usersController.createUser);
usersRoutes.post('/activate', usersController.activateUser);

usersRoutes.use(userAuth);

usersRoutes.put(
  '/',
  multer(multerConfig).single('file'),
  usersController.editUser
);

module.exports = usersRoutes;
