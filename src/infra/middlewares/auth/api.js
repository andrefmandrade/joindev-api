const { authApi } = require('../../../shared/config/auth');
const AppError = require('../../../shared/errors/AppError');

function apiAuth(req, res, next) {
  if (req.headers['x-request-access'] !== authApi) {
    throw new AppError('Acesso não autorizado');
  }

  return next();
}

module.exports = apiAuth;
