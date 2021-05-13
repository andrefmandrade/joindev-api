const { options, transporter } = require('../config/mail');
const { frontUrl } = require('../config/server');
const { serverUrl } = require('../config/server');
const AppError = require('../errors/AppError');
const mustache = require('mustache');
const fs = require('fs');
const path = require('path');

class SendResetPasswordEmailService {
  execute({ email, resetToken, userToken }) {
    return new Promise((resolve) => {
      const activationTemplate = fs.readFileSync(
        path.resolve(__dirname, './template/ResetPasswordTemplate.html'),
        'utf8'
      );

      const activateUrl = `${frontUrl}/resetPassword/${resetToken}/${userToken}`;

      const html = mustache.render(activationTemplate, {
        activateUrl,
      });

      options.html = html;

      options.to = email;
      options.subject = 'Recuperação de senha';
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
