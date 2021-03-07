const express = require('express');
const path = require('path');
const errorHandler = require('../middlewares/errors/processingError');
const usersRoutes = require('../../modules/users/routes/users.routes');
const sessionsRoutes = require('../../modules/users/routes/sessions.routes');

const routes = express.Router();

routes.get('/favicon.ico', (_, res) =>
  res.sendFile(path.resolve('public', 'favicon.ico'))
);

routes.use(
  '/swagger/customCss',
  express.static(path.resolve('src', 'infra', 'docs', 'custom.css'))
);

routes.use('/users', usersRoutes);
routes.use('/sessions', sessionsRoutes);

routes.use(errorHandler);

module.exports = routes;
