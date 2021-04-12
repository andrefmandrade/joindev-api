const express = require('express');
const path = require('path');
const errorHandler = require('../middlewares/errors/processingError');
const usersRoutes = require('../../modules/users/routes/users.routes');
const sessionsRoutes = require('../../modules/sessions/routes/sessions.routes');
const resetPasswordRoutes = require('../../modules/resetPasswords/routes/resetPassword.routes');
const adminRoutes = require('../../modules/admin/routes/admin.routes');
const colabsRoutes = require('../../modules/colabs/routes/colabs.routes');
const jobsRoutes = require('../../modules/jobs/routes/jobs.routes');
const eventsRoutes = require('../../modules/events/routes/events.routes');

const routes = express.Router();

routes.get('/favicon.ico', (_, res) =>
  res.sendFile(path.resolve('public', 'favicon.ico'))
);

routes.use(
  '/static',
  express.static(path.resolve('src', 'shared', 'resources', 'img'))
);

routes.get('/version', (_, res) => res.send('1.1'));
routes.use('/admin', adminRoutes);

routes.use('/users', usersRoutes);
routes.use('/sessions', sessionsRoutes);
routes.use('/resetPassword', resetPasswordRoutes);
routes.use('/colabs', colabsRoutes);
routes.use('/jobs', jobsRoutes);
routes.use('/events', eventsRoutes);

routes.use(errorHandler);

module.exports = routes;
