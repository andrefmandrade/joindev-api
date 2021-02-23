const { options, transporter } = require('../../../shared/config/mail');
const { serverUrl } = require('../../../shared/config/server');

class SendActivationEmailService {
  execute({ email, url }) {
    options.to = email;
    options.subject = 'Boas vindas';
    options.html = `<h1>Seja Bem Vindo</h1><br/><p>Acesse ${
      serverUrl + url
    } para ativar a sua conta</p>`;
    transporter.close();
    transporter.sendMail(options, (error, info) => {
      if (error)
        return console.log(
          'Error sending activation email: ' + error.toString()
        );
      console.log(`Activation email sent to ${email}: ${info.response}`);
    });
  }
}

module.exports = SendActivationEmailService;
