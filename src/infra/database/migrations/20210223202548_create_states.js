exports.up = function (knex) {
  return knex.schema.createTable('states', function (table) {
    table.increments('id').primary();

    table.string('name', 100).notNullable().unique();

    table.string('uf', 2).notNullable().unique();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('states');
};
