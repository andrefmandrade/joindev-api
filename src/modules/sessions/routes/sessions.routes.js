const express = require('express');
const SessionsController = require('../controllers/SessionsController');
const apiAuth = require('../../../infra/middlewares/auth/api');

const sessionsController = new SessionsController();
const sessionsRoutes = express.Router();

sessionsRoutes.use(apiAuth);

sessionsRoutes.post('/', sessionsController.loginSession);

module.exports = sessionsRoutes;
