const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const AppError = require('../../../shared/errors/AppError');
const { secret } = require('../../../shared/config/auth');

async function userAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.header('requireSignIn', 'true');
    throw new AppError('Acesso não autorizado, por favor faça login novamente');
  }

  const token = authHeader.split(' ')[1];

  try {
    const { id } = await promisify(jwt.verify)(token, secret);
    req.userId = id;
    return next();
  } catch (e) {
    throw new AppError('Acesso não autorizado, por favor faça login novamente');
  }
}

module.exports = userAuth;
