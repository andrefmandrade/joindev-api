const { authApi } = require('../../../shared/config/auth');
const AppError = require('../../../shared/errors/AppError');

function apiAuth(req, res, next) {

  if (req.headers.api_auth !== authApi) {
    throw new AppError(
      'Acesso não autorizado'
    );
  }

  return next();
}

module.exports = apiAuth;