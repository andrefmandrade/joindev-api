const { onUpdateTrigger } = require('../../../../knexfile');

exports.up = function (knex) {
  return knex.schema
    .createTable('events', function (table) {
      table.increments('id').primary();

      table.string('title').notNullable();

      table.string('address');

      table.string('url');

      table.date('date');

      table.text('details').notNullable();

      table.string('image');

      table.integer('id_user').unsigned();

      table.foreign('id_user').references('id').inTable('users');

      table.timestamps(true, true);
    })
    .then(() => knex.raw(onUpdateTrigger('events')));
};

exports.down = function (knex) {
  return knex.schema.dropTable('events');
};
