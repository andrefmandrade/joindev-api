const nodemailer = require('nodemailer');
require('dotenv/config');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const options = {
  from: process.env.EMAIL_USER
}

module.exports = {
  transporter,
  options
}
