const { onUpdateTrigger } = require('../../../../knexfile');

exports.up = function (knex) {
  return knex.schema
    .createTable('jobs', function (table) {
      table.increments('id').primary();

      table.string('title').notNullable();

      table.string('company');

      table.string('city');

      table.string('contact');

      table.text('details').notNullable();

      table.integer('id_user').unsigned();

      table.foreign('id_user').references('id').inTable('users');

      table.timestamps(true, true);
    })
    .then(() => knex.raw(onUpdateTrigger('jobs')));
};

exports.down = function (knex) {
  return knex.schema.dropTable('jobs');
};
