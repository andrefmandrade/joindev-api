const AppError = require('../../../shared/errors/AppError');
const { decrypt, isEmpty } = require('../../../shared/utils');

class ActivateUserService {
  constructor(repository) {
    this.repository = repository;
  }

  async execute({ userToken }) {
    const email = decrypt(userToken);
    const usersExists = await this.repository.findUserByEmail(email);

    if (!usersExists) throw new AppError('O usuário não foi encontrado');

    if (!isEmpty(usersExists.confirmated_at))
      throw new AppError('A conta já está ativa');

    const activateUser = await this.repository.activateUser(usersExists.email);

    if (!activateUser) throw new AppError('Não foi possível ativar a conta');

    return activateUser;
  }
}

module.exports = ActivateUserService;
