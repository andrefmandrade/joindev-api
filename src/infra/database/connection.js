const knex = require('knex');
const config = require('../../../knexfile');

const environment = process.env.ENVIRONMENT || 'production';

const connection = environment === 'development' ? knex(config.development) : knex(config.production);

module.exports = connection;
