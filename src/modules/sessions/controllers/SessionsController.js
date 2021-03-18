const UsersRepository = require('../../users/repositories/UsersRepository');
const LoginSessionService = require('../services/LoginSessionService');
const AppError = require('../../../shared/errors/AppError');
const { isEmpty, isEmail } = require('../../../shared/utils');

const usersRepository = new UsersRepository();

class SessionController {
  async loginSession(req, res) {
    const { email, password } = req.body;

    if (isEmpty(email, password))
      throw new AppError(
        'Os campos e-mail e senha são obrigatórios, por favor insira-os e tente novamente'
      );

    if (!isEmail(email)) throw new AppError('Senha e/ou e-mail inválidos');

    const loginSessionService = new LoginSessionService(usersRepository);
    const userAuthenticated = await loginSessionService.execute({
      email,
      password,
    });

    return res.json({
      success: true,
      message: 'Usuário logado com sucesso',
      user: userAuthenticated,
    });
  }

  async readSession(req, res) {
    return res.json({
      success: true,
      message: 'Usuário logado com sucesso',
    });
  }
}

module.exports = SessionController;
