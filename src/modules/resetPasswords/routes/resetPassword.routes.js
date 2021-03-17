const express = require('express');
const ResetPasswordController = require('../controllers/ResetPasswordController');
const apiAuth = require('../../../infra/middlewares/auth/api');

const resetPasswordController = new ResetPasswordController();
const resetPasswordRoutes = express.Router();

resetPasswordRoutes.use(apiAuth);

resetPasswordRoutes.post('/', resetPasswordController.createResetPassword);
resetPasswordRoutes.put('/', resetPasswordController.updateResetPassword);

module.exports = resetPasswordRoutes;
