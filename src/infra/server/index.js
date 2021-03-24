const express = require('express');
require('express-async-errors');
const helmet = require('helmet');
const cors = require('cors');
const routes = require('../routes');

const app = express();

const allowList = [
  'https://joindev-reactjs.vercel.app/',
  'http://localhost:3000/',
];

const corsOptionsDelegate = (req, callback) => {
  let corsOptions;

  let isDomainAllowed = allowList.indexOf(req.header('Origin')) !== -1;

  if (isDomainAllowed) {
    // Enable CORS for this request
    corsOptions = { origin: true };
  } else {
    // Disable CORS for this request
    corsOptions = { origin: false };
  }
  callback(null, corsOptions);
};

app.use(helmet());
app.use(cors(corsOptionsDelegate));
app.use(express.json());
app.use(routes);

module.exports = app;
