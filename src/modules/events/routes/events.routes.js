const express = require('express');
const EventsController = require('../controllers/EventsController');
const apiAuth = require('../../../infra/middlewares/auth/api');
const userAuth = require('../../../infra/middlewares/auth/user');
const multer = require('multer');
const multerConfig = require('../../../shared/config/multer');

const eventsController = new EventsController();
const eventsRoutes = express.Router();

eventsRoutes.use(apiAuth);
eventsRoutes.use(userAuth);

eventsRoutes.post(
  '/',
  multer(multerConfig).single('file'),
  eventsController.createEvent
);
eventsRoutes.get('/', eventsController.getEvents);
eventsRoutes.get('/:id', eventsController.getEvent);

module.exports = eventsRoutes;
