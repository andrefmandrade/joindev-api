exports.seed = function (knex) {
  return knex('states').then(function () {
    return knex('states').insert([
      { name: 'Acre', uf: 'AC' },
      { name: 'Alagoas', uf: 'AL' },
      { name: 'Amazonas', uf: 'AM' },
      { name: 'Amapá', uf: 'AP' },
      { name: 'Bahia', uf: 'BA' },
      { name: 'Ceará', uf: 'C' },
      { name: 'Distrito Federal', uf: 'DF' },
      { name: 'Espírito Santo', uf: 'ES' },
      { name: 'Goiás', uf: 'GO' },
      { name: 'Maranhão', uf: 'MA' },
      { name: 'Minas Gerais', uf: 'MG' },
      { name: 'Mato Grosso do Sul', uf: 'MS' },
      { name: 'Mato Grosso', uf: 'MT' },
      { name: 'Pará', uf: 'PA' },
      { name: 'Paraíba', uf: 'PB' },
      { name: 'Pernambuco', uf: 'P' },
      { name: 'Piauí', uf: 'PI' },
      { name: 'Paraná', uf: 'PR' },
      { name: 'Rio de Janeiro', uf: 'RJ' },
      { name: 'Rio Grande do Norte', uf: 'RN' },
      { name: 'Rondônia', uf: 'RO' },
      { name: 'Roraima', uf: 'RR' },
      { name: 'Rio Grande do Sul', uf: 'RS' },
      { name: 'Santa Catarina', uf: 'SC' },
      { name: 'Sergipe', uf: 'S' },
      { name: 'São Paulo', uf: 'SP' },
      { name: 'Tocantins', uf: 'TO' },
    ]);
  });
};
