exports.up = function (knex) {
  return knex.schema.alterTable('events', function (table) {
    table.dateTime('date').alter();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('events', function (table) {
    table.date('date').alter();
  });
};
