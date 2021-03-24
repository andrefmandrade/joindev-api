const express = require('express');
require('express-async-errors');
const helmet = require('helmet');
const cors = require('cors');
const routes = require('../routes');

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(routes);

module.exports = app;
