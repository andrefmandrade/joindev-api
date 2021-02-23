const { serverPort } = require('./shared/config/server');
const server = require('./infra/server');

server.listen(serverPort, () => {
  console.log('Server running in port ' + serverPort);
});
