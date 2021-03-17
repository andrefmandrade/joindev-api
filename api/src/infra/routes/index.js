const express = require('express');
const path = require('path');
const errorHandler = require('../middlewares/errors/processingError');
const usersRoutes = require('../../modules/users/routes/users.routes');
const sessionsRoutes = require('../../modules/sessions/routes/sessions.routes');
const resetPasswordRoutes = require('../../modules/resetPasswords/routes/resetPassword.routes');

const routes = express.Router();

routes.get('/favicon.ico', (_, res) =>
  res.sendFile(path.resolve('public', 'favicon.ico'))
);

routes.get('/ping', (_, res) =>
  res.send(`Todos as descrições das pessoas são sobre a humanidade do atendimento, a pessoa pega no pulso, examina, olha com carinho. Então eu acho que vai ter outra coisa, que os médicos cubanos trouxeram pro brasil, um alto grau de humanidade.

A única área que eu acho, que vai exigir muita atenção nossa, e aí eu já aventei a hipótese de até criar um ministério. É na área de... Na área... Eu diria assim, como uma espécie de analogia com o que acontece na área agrícola.

Eu dou dinheiro pra minha filha. Eu dou dinheiro pra ela viajar, então é... é... Já vivi muito sem dinheiro, já vivi muito com dinheiro. -Jornalista: Coloca esse dinheiro na poupança que a senhora ganha R$10 mil por mês. -Dilma: O que que é R$10 mil?`)
);

routes.use('/users', usersRoutes);
routes.use('/sessions', sessionsRoutes);
routes.use('/resetPassword', resetPasswordRoutes);

routes.use(errorHandler);

module.exports = routes;
