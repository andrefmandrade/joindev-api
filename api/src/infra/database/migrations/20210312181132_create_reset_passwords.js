const { onUpdateTrigger } = require('../../../../knexfile');

exports.up = function (knex) {
  return knex.schema
    .createTable('reset_passwords', function (table) {
      table.increments('id').primary();

      table.string('user_token').notNullable();

      table.string('reset_token').notNullable();

      table.boolean('expired').notNullable().defaultTo(false);

      table.integer('id_user').unsigned();

      table.foreign('id_user').references('id').inTable('users');

      table.timestamps(true, true);
    })
    .then(() => knex.raw(onUpdateTrigger('reset_passwords')));
};

exports.down = function (knex) {
  return knex.schema.dropTable('reset_passwords');
};
