const UsersRepository = require('../repositories/UsersRepository');
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

    if (!isEmail(email))
      throw new AppError(
        'O e-mail informado é inválido, por favor insira um e-mail válido'
      );

    const loginSessionService = new LoginSessionService(usersRepository);
    const userAuthenticated = await loginSessionService.execute({
      email,
      password
    });

    return res.json({
      success: true,
      message: 'Usuário logado com sucesso',
      user: userAuthenticated
    });
  }
}

module.exports = SessionController;