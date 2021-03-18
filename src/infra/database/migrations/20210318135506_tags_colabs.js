const { onUpdateTrigger } = require('../../../../knexfile');

exports.up = function(knex) {
  return knex.schema
    .createTable('tags_colabs', function (table) {
      table.increments('id').primary();

      table.string('title', 255).notNullable();

      table.boolean('deleted').notNullable().defaultTo(false);

      table.timestamps(true, true);
    })
    .then(() => knex.raw(onUpdateTrigger('tags_colabs')));
};

exports.down = function(knex) {
  return knex.schema.dropTable('tags_colabs');
};
