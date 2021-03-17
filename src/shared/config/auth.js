require('dotenv/config');

const secret = process.env.SECRET_AUTH;
const expiresIn = '10d';
const authApi = process.env.SECRET_API;

module.exports = {
  secret,
  expiresIn,
  authApi,
};
