require('dotenv/config');

const serverPort = parseInt(process.env.PORT) || 4000;
const serverUrl = process.env.SERVER_URL;
const frontUrl = process.env.FRONT_URL;
const environment = process.env.ENVIRONMENT || 'production';

module.exports = {
  serverPort,
  serverUrl,
  frontUrl,
  environment
};
