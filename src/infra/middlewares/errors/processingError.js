const path = require('path');
const AppError = require('../../../shared/errors/AppError');

function errorHandler(error, req, res, next) {
  if (error instanceof AppError) return res.json({
    success: false,
    message: error.message
  });

  console.log(error);
  return res.json({
    success: false,
    message: 'Erro interno no servidor'
  });
}

module.exports = errorHandler;
