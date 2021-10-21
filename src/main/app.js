const express = require('express');
const setupApp = require('./config/setup');
const app = express();

setupApp(app);

module.exports = app;
