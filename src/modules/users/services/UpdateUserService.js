const bcryptjs = require('bcryptjs');
const AppError = require('../../../shared/errors/AppError');

class UpdateUserService {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(user) {
    const userUpdated = await this.repository.updateUser(user);

    if (!userUpdated)
      throw new AppError('Ocorreu um erro ao atualizar o usuário');

    return userUpdated;
  }

  async passwordMatchExecute(userData) {
    const passwordMatch = this.repository.matchPassword({
      oldPassword: userData.oldPassword,
      idUser: userData.idUser,
    });

    return passwordMatch;
  }

  async passwordEncrypt(password) {
    return await bcryptjs.hashSync(password, 10);
  }
}

module.exports = UpdateUserService;
