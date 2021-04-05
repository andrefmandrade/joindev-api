const { onUpdateTrigger } = require('../../../../knexfile');

exports.up = function (knex) {
  return knex.schema
    .createTable('comments_colabs', function (table) {
      table.increments('id').primary();

      table.text('text').notNullable();

      table.integer('id_user').unsigned();

      table.foreign('id_user').references('id').inTable('users');

      table.integer('id_colab').unsigned();

      table.foreign('id_colab').references('id').inTable('colabs');

      table.boolean('deleted').notNullable().defaultTo(false);

      table.timestamps(true, true);
    })
    .then(() => knex.raw(onUpdateTrigger('comments_colabs')));
};

exports.down = function (knex) {
  return knex.schema.dropTable('comments_colabs');
};
