const express = require('express');
const JobsController = require('../controllers/JobsController');
const apiAuth = require('../../../infra/middlewares/auth/api');
const userAuth = require('../../../infra/middlewares/auth/user');

const jobsController = new JobsController();
const jobsRoutes = express.Router();

jobsRoutes.use(apiAuth);
jobsRoutes.use(userAuth);

jobsRoutes.post('/', jobsController.createJob);
jobsRoutes.get('/', jobsController.getJobs);
jobsRoutes.get('/:id', jobsController.getJob);
jobsRoutes.delete('/:id', jobsController.deleteJob);

module.exports = jobsRoutes;
