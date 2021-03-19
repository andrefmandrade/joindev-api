exports.seed = function (knex) {
  return knex('tags_colabs').then(function () {
    return knex('tags_colabs').insert([
      { title: 'Artigo' },
      { title: 'Dúvida' },
      { title: 'Problema' },
      { title: 'Solução' },
      { title: 'Dica' },
    ]);
  });
};
