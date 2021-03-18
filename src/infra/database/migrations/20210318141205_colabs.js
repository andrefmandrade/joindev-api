const { onUpdateTrigger } = require('../../../../knexfile');

exports.up = function(knex) {
  return knex.schema
    .createTable('colabs', function (table) {
      table.increments('id').primary();

      table.string('title', 255).notNullable();

      table.text('text').notNullable();

      table.integer('id_user').unsigned();

      table.foreign('id_user').references('id').inTable('users');

      table.boolean('deleted').notNullable().defaultTo(false);

      table.timestamps(true, true);
    })
    .then(() => knex.raw(onUpdateTrigger('colabs')));
};

exports.down = function(knex) {
  return knex.schema.dropTable('colabs');
};
