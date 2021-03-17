const { serverPort } = require('./shared/config/server');
const server = require('./infra/server');

const https = require('https');

setInterval(() => {
  https.get('https://joindev-api.herokuapp.com/ping');
}, 1200000);

server.listen(serverPort, () => {
  console.log('Server running in port ' + serverPort);
});
