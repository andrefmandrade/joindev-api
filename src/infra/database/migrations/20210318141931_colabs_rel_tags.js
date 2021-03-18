exports.up = function(knex) {
  return knex.schema.createTable('colabs_rel_tags', function (table) {
    table.increments('id').primary();

    table.integer('id_colab').unsigned().notNullable();

    table.foreign('id_colab').references('id').inTable('colabs');

    table.integer('id_tag').unsigned().notNullable();

    table.foreign('id_tag').references('id').inTable('tags_colabs');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('colabs_rel_tags');
};
