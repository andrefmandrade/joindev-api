const path = require('path');
const AppError = require('../../../shared/errors/AppError');
const ResetPasswordError = require('../../../shared/errors/ResetPasswordError');

function errorHandler(error, req, res, next) {
  if (error instanceof AppError) return res.json({
    success: false,
    message: error.message
  });

  if (error instanceof ResetPasswordError) return res.sendFile(
    path.resolve('public', 'error', 'index.html')
  );

  console.log(error);
  return res.json({
    success: false,
    message: 'Erro interno no servidor'
  });
}

module.exports = errorHandler;