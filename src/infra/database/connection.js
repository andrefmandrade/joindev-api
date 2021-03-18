const knex = require('knex');
const config = require('../../../knexfile');
const { environment } = require('../../shared/config/server');

const connection = environment === 'development' ? knex(config.development) : knex(config.production);

module.exports = connection;
