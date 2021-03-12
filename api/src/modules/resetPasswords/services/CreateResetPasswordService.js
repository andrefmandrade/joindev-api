const AppError = require('../../../shared/errors/AppError');
const { encrypt, simpleHash } = require('../../../shared/utils');

class CreateResetPasswordService {
  constructor(repository, usersRepository) {
    this.repository = repository;
    this.usersRepository = usersRepository;
  }

  async execute(email) {
    const usersExists = await this.usersRepository.findUserByEmail(email);

    if (!usersExists)
      throw new AppError(
        'O e-mail informado é inválido, por favor insira um e-mail válido'
      );

    const emailEncrypted = encrypt(email);
    const hashRequest = simpleHash(4);

    const newRequestReset = await this.repository.createResetPassword({
      resetToken: hashRequest,
      userToken: emailEncrypted,
      userId: usersExists.id,
    });

    if (!newRequestReset)
      throw new AppError(
        'Erro ao solicitar alteração de senha, por favor tente novamente'
      );

    return newRequestReset;
  }
}

module.exports = CreateResetPasswordService;
