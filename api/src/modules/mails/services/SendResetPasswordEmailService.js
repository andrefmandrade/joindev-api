const { options, transporter } = require('../../../shared/config/mail');
const { serverUrl } = require('../../../shared/config/server');

class SendResetPasswordEmailService {
  execute({ email, url }) {
    return new Promise((resolve) => {
      options.to = email;
      options.subject = 'Recuperação de senha';
      options.html = `<p>Acesse ${
        serverUrl + url
      } para recuperar sua senha.</p>`;
      transporter.close();
      transporter.sendMail(options, (error, info) => {
        if (error) {
          console.log(
            'Error sending reset password email: ' + error.toString()
          );
          return resolve(false);
        }
        console.log(`Reset Password email sent to ${email}: ${info.response}`);
        resolve(true);
      });
    });
  }
}

module.exports = SendResetPasswordEmailService;
