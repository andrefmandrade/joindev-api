require('dotenv/config');

const serverPort = parseInt(process.env.PORT) || 4000;
const serverUrl = process.env.SERVER_URL;
const frontUrl = process.env.FRONT_URL;

module.exports = {
  serverPort,
  serverUrl,
  frontUrl,
};
