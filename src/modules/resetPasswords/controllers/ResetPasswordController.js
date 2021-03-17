const UsersRepository = require('../../users/repositories/UsersRepository');
const ResetPasswordRepository = require('../repositories/ResetPasswordRepository');
const CreateResetPasswordService = require('../services/CreateResetPasswordService');
const ResetPasswordUserService = require('../services/ResetPasswordUserService');
const SendResetPasswordEmailService = require('../../../shared/mails/SendResetPasswordEmailService');
const AppError = require('../../../shared/errors/AppError');
const { isEmpty, isEmail } = require('../../../shared/utils');

const usersRepository = new UsersRepository();
const resetPasswordRepository = new ResetPasswordRepository();

class ResetPasswordController {
  async createResetPassword(req, res) {
    const { email } = req.body;

    if (!email || !isEmail(email))
      throw new AppError(
        'O e-mail informado é inválido, por favor insira um e-mail válido'
      );

    const createResetPasswordService = new CreateResetPasswordService(
      resetPasswordRepository,
      usersRepository
    );
    const requestResetPassword = await createResetPasswordService.execute(
      email
    );

    const sendResetPasswordEmailService = new SendResetPasswordEmailService();
    await sendResetPasswordEmailService.execute({
      email,
      resetToken: requestResetPassword.resetToken,
      userToken: requestResetPassword.userToken,
    });

    return res.json({
      success: true,
      message: 'Alteração de senha solicitada com êxito, verifique o seu email',
    });
  }

  async updateResetPassword(req, res) {
    const { password, repeatPassword, userToken, resetToken } = req.body;

    if (isEmpty(userToken, resetToken))
      throw new AppError('O usuário não foi encontrado');

    if (isEmpty(password, repeatPassword))
      throw new AppError(
        'Necessário informar a nova senha e confirmar a nova senha'
      );

    if (password !== repeatPassword)
      throw new AppError(
        'As senhas informadas devem ser iguais, por favor verifique-as'
      );

    const resetPasswordUserService = new ResetPasswordUserService(
      resetPasswordRepository,
      usersRepository
    );

    const passwordUpdated = await resetPasswordUserService.execute({
      password,
      userToken,
      resetToken,
    });

    return res.json({
      success: true,
      message: 'Senha atualizada com sucesso',
      user: passwordUpdated,
    });
  }
}

module.exports = ResetPasswordController;
