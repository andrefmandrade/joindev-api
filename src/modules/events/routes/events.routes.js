const express = require('express');
const EventsController = require('../controllers/EventsController');
const apiAuth = require('../../../infra/middlewares/auth/api');
const userAuth = require('../../../infra/middlewares/auth/user');

const eventsController = new EventsController();
const eventsRoutes = express.Router();

eventsRoutes.use(apiAuth);
eventsRoutes.use(userAuth);

eventsRoutes.post('/', eventsController.createEvent);
eventsRoutes.get('/', eventsController.getEvents);
eventsRoutes.get('/:id', eventsController.getEvent);

module.exports = eventsRoutes;
