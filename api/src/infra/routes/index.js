const express = require('express');
const path = require('path');
const errorHandler = require('../middlewares/errors/processingError');
const usersRoutes = require('../../modules/users/routes/users.routes');
const sessionsRoutes = require('../../modules/sessions/routes/sessions.routes');
const resetPasswordRoutes = require('../../modules/resetPasswords/routes/resetPassword.routes');

const routes = express.Router();

routes.get('/favicon.ico', (_, res) =>
  res.sendFile(path.resolve('public', 'favicon.ico'))
);

routes.use('/users', usersRoutes);
routes.use('/sessions', sessionsRoutes);
routes.use('/resetPassword', resetPasswordRoutes);

routes.use(errorHandler);

module.exports = routes;
