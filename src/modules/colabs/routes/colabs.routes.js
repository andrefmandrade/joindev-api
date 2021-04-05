const express = require('express');
const ColabsController = require('../controllers/ColabsController');
const apiAuth = require('../../../infra/middlewares/auth/api');
const userAuth = require('../../../infra/middlewares/auth/user');

const colabsController = new ColabsController();
const colabsRoutes = express.Router();

colabsRoutes.use(apiAuth);
colabsRoutes.use(userAuth);

colabsRoutes.post('/', colabsController.createColab);
colabsRoutes.get('/', colabsController.getColabs);
colabsRoutes.get('/:id', colabsController.getColab);
colabsRoutes.get('/tags', colabsController.getTagsColab);

module.exports = colabsRoutes;
