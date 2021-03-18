const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../../../shared/config/auth');
const AppError = require('../../../shared/errors/AppError');
const { diferenceBetweenDates, decrypt } = require('../../../shared/utils');

class ResetPasswordUserService {
  constructor(repository, usersRepository) {
    this.repository = repository;
    this.usersRepository = usersRepository;
  }

  async execute({ password, userToken, resetToken }) {
    const requestReset = await this.repository.getActiveResetRequest({
      resetToken,
      userToken,
    });

    if (!requestReset)
      throw new AppError(
        'O link de recuperação de senha expirou, por favor solicite outro email'
      );

    const diffDates = diferenceBetweenDates(new Date(), requestReset.createdAt);

    if (diffDates > 1) {
      this.repository.expireRequest(requestReset.id);
      throw new AppError(
        'O link de recuperação de senha expirou, por favor solicite outro email'
      );
    }

    const email = decrypt(userToken);

    const user = await this.usersRepository.findUserByEmail(email);

    if (!user) throw new AppError('O Usuário não foi encontrado');

    const passwordEncripted = await bcryptjs.hashSync(password, 10);

    const userSaved = await this.usersRepository.updateUser({
      id: user.id,
      password: passwordEncripted,
    });

    this.repository.expireRequest(requestReset.id);

    return {
      name: userSaved.name,
      photo: userSaved.photo,
      token: jwt.sign({ id: userSaved.id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    };
  }
}

module.exports = ResetPasswordUserService;
