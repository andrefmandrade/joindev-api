const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const AppError = require('../../../shared/errors/AppError');
const UsersRepository = require('../../../modules/users/repositories/UsersRepository');
const { secret, expiresIn } = require('../../../shared/config/auth');

const usersRepository = new UsersRepository();

async function userAuth(req, res, next) {

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.header('requireSignIn', 'true');
    throw new AppError(
      'Acesso não autorizado, por favor faça login novamente'
    );
  };

  const token = authHeader.split(' ')[1];

  try {

    const { id } = await promisify(jwt.verify)(token, secret);
    req.userId = id;

    return next();

  } catch (e) {


    const userExists = await usersRepository.findUserByToken(token);

    if (!userExists) {
      res.header('requireSignIn', 'true');
      throw new AppError(
        'Acesso não autorizado, por favor faça login novamente'
      );
    };

    const auth = jwt.sign({ id: userExists.id }, secret, { expiresIn });

    userExists.access_token = auth;
    await usersRepository.updateUser(userExists);

    res.header('updateToken', auth);
    req.userId = userExists.id;

    return next();
  }
}

module.exports = userAuth;