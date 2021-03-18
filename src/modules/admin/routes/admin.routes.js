const express = require('express');
const AdminController = require('../controllers/AdminController');
const apiAuth = require('../../../infra/middlewares/auth/api');

const adminController = new AdminController();
const adminRoutes = express.Router();

adminRoutes.use(apiAuth);

adminRoutes.delete('/drop/all', adminController.dropAllInfo);

module.exports = adminRoutes;
