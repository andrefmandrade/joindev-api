require('dotenv/config');

const client = process.env.DB_CLIENT;
const host = process.env.DB_HOST;
const port = process.env.DB_PORT;
const user = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const database = process.env.DB_DATABASE;
const minPool = parseInt(process.env.DB_MIN_POOL);
const maxPool = parseInt(process.env.DB_MAX_POOL);

module.exports = {
  client,
  connection: {
    host,
    user,
    password,
    database,
    port
  },
  migrations: {
    tableName: 'migrations',
    directory: './src/infra/database/migrations',
  },
  pool: {
    min: minPool,
    max: maxPool
  },
  useNullAsDefault: true,
}
