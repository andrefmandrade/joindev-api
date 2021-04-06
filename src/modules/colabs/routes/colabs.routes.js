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
colabsRoutes.get('/tags', colabsController.getTagsColab);
colabsRoutes.post('/comments', colabsController.createColabComment);
colabsRoutes.get('/:id', colabsController.getColab);

module.exports = colabsRoutes;
