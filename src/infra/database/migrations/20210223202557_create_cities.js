exports.up = function (knex) {
  return knex.schema.createTable('cities', function (table) {
    table.increments('id').primary();

    table.string('name', 100).notNullable();

    table.integer('state_id').unsigned().notNullable();

    table.foreign('state_id').references('id').inTable('states');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('cities');
};
