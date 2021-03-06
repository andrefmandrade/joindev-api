const UsersRepository = require('../repositories/UsersRepository');
const CreateUserService = require('../services/CreateUserService');
const ActivateUserService = require('../services/ActivateUserService');
const SendActivationEmailService = require('../../mails/services/SendActivationEmailService');
const AppError = require('../../../shared/errors/AppError');
const { isEmpty, isEmail } = require('../../../shared/utils');

const usersRepository = new UsersRepository();

class UsersController {
  async createUser(req, res) {
    const { name, email, password, isCompany } = req.body;

    if (isEmpty(name, email, password))
      throw new AppError(
        'Os campos nome, e-mail e senha são obrigatórios, por favor insira-os e tente novamente'
      );

    if (!isEmail(email))
      throw new AppError(
        'O e-mail informado é inválido, por favor insira um e-mail válido'
      );

    if (password.length < 6)
      throw new AppError(
        'A senha deve conter no mínimo 6 caracteres, por favor insira uma senha válida'
      );

    const createUserService = new CreateUserService(usersRepository);
    const user = await createUserService.execute({
      name,
      email,
      password,
      isCompany,
    });

    const sendActivationEmailService = new SendActivationEmailService();
    sendActivationEmailService.execute({
      email,
      url: `/users/activate/${user.userToken}`,
    });

    return res.json({
      success: true,
      message: 'Usuário criado com sucesso',
    });
  }

  async activateUser(req, res) {
    const { userToken } = req.params;

    const activateUserService = new ActivateUserService(usersRepository);
    const activationComplete = await activateUserService.execute({
      userToken
    });

    return res.json({
      success: true,
      message: 'Conta ativada com sucesso',
      user: activationComplete
    });
  }
}

module.exports = UsersController;
