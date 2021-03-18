const express = require('express');
const SessionsController = require('../controllers/SessionsController');
const apiAuth = require('../../../infra/middlewares/auth/api');
const userAuth = require('../../../infra/middlewares/auth/user');

const sessionsController = new SessionsController();
const sessionsRoutes = express.Router();

sessionsRoutes.use(apiAuth);

sessionsRoutes.post('/', sessionsController.loginSession);

usersRoutes.use(userAuth);
sessionsRoutes.get('/', sessionsController.readSession);

module.exports = sessionsRoutes;
