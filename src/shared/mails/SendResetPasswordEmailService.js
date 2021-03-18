const { options, transporter } = require('../config/mail');
const { frontUrl } = require('../config/server');
const AppError = require('../errors/AppError');

class SendResetPasswordEmailService {
  execute({ email, resetToken, userToken }) {
    return new Promise((resolve) => {
      options.to = email;
      options.subject = 'Recuperação de senha';
      options.html = `<p>Acesse ${frontUrl}/resetPassword/${resetToken}/${userToken} para recuperar sua senha.</p>`;
      transporter.close();
      transporter.sendMail(options, (error, info) => {
        if (error) {
          console.log(
            'Error sending reset password email: ' + error.toString()
          );
          throw new AppError(
            'Ocorreu um erro ao enviar o emaild e recuperação'
          );
        }
        console.log(`Reset Password email sent to ${email}: ${info.response}`);
        resolve(true);
      });
    });
  }
}

module.exports = SendResetPasswordEmailService;
