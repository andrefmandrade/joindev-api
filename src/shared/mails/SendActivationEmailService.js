const fs = require('fs');
const path = require('path');
const { options, transporter } = require('../config/mail');
const { frontUrl } = require('../config/server');
const { serverUrl } = require('../config/server');
const mustache = require('mustache');

class SendActivationEmailService {
  execute({ email, token }) {
    const activationTemplate = fs.readFileSync(
      path.resolve(__dirname, './template/ActivationTemplate.html'),
      'utf8'
    );

    const activateUrl = frontUrl + '/activate/' + token;

    const html = mustache.render(template, {
      activateUrl,
      logo: serverUrl + '/static/logo.png',
    });

    options.html = html;
    options.to = email;
    options.subject = 'Boas vindas';

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
