require('dotenv').config();

const express = require('express');
const app = express();

const setupApp = require('./config/setup');
const setupRoutes = require('./config/routes');

setupApp(app);
setupRoutes(app);

module.exports = app;
