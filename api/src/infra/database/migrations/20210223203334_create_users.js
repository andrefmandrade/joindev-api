const { onUpdateTrigger } = require('../../../../knexfile');

const ON_UPDATE_TIMESTAMP_FUNCTION = `
  CREATE OR REPLACE FUNCTION on_update_timestamp()
  RETURNS trigger AS $$
  BEGIN
    NEW.updated_at = now();
    RETURN NEW;
  END;
$$ language 'plpgsql';
`;

const DROP_ON_UPDATE_TIMESTAMP_FUNCTION = `DROP FUNCTION on_update_timestamp`;

exports.up = function (knex) {
  return knex.schema
    .createTable('users', function (table) {
      table.increments('id').primary();

      table.string('name', 50).notNullable();

      table.string('email', 50).notNullable().unique();

      table.string('password').notNullable();

      table.string('photo').nullable();

      table.boolean('is_company').defaultTo(false);

      table.integer('id_state').unsigned();

      table.foreign('id_state').references('id').inTable('states');

      table.integer('id_city').unsigned();

      table.foreign('id_city').references('id').inTable('cities');

      table.timestamp('confirmated_at');

      table.timestamps(true, true);
    })
    .then(() => knex.raw(ON_UPDATE_TIMESTAMP_FUNCTION))
    .then(() => knex.raw(onUpdateTrigger('users')));
};

exports.down = function (knex) {
  return knex.schema
    .dropTable('users')
    .then(() => knex.raw(DROP_ON_UPDATE_TIMESTAMP_FUNCTION));
};
