const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AppError = require('../../../shared/errors/AppError');
const { isEmpty, encrypt } = require('../../../shared/utils');
const authConfig = require('../../../shared/config/auth');
const SendActivationEmailService = require('../../../shared/mails/SendActivationEmailService');

class LoginSessionService {
  constructor(repository) {
    this.repository = repository;
  }

  async execute({ email, password }) {
    const usersExists = await this.repository.findUserByEmail(email);

    if (!usersExists) throw new AppError('O usuário não foi encontrado');

    if (isEmpty(usersExists.confirmated_at)) {
      const sendActivationEmailService = new SendActivationEmailService();
      sendActivationEmailService.execute({
        email,
        token: encrypt(usersExists.email),
      });

      throw new AppError(
        'Conta não verificada, acesse seu e-mail para ativar a sua conta'
      );
    }

    const passwordMatch = bcryptjs.compareSync(password, usersExists.password);

    if (!passwordMatch) throw new AppError('Senha e/ou e-mail inválidos');

    return {
      name: usersExists.name,
      photo: usersExists.photo,
      token: jwt.sign({ id: usersExists }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    };
  }
}

module.exports = LoginSessionService;
