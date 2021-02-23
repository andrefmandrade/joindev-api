const bcryptjs = require('bcryptjs');
const AppError = require('../../../shared/errors/AppError');
const { encrypt } = require('../../../shared/utils');

class CreateUserService {
  constructor(repository) {
    this.repository = repository;
  }

  async execute({ email, name, password, isCompany }) {
    const usersExists = await this.repository.findUserByEmail(email);

    if (!!usersExists)
      throw new AppError(
        'O e-mail informado já está em uso por outra conta, por favor insira outro e-mail'
      );

    const passwordEncripted = await bcryptjs.hashSync(password, 10);

    const userCreated = await this.repository.createUser({
      name,
      email,
      password: passwordEncripted,
      is_company: isCompany,
    });

    if (!userCreated)
      throw new AppError('Ocorreu um erro ao criar o novo usuário');

    return {
      ...userCreated,
      userToken: encrypt(email),
    };
  }
}

module.exports = CreateUserService;
