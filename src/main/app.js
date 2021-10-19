const express = require('express');
const setupApp = require('./config/setup');
const app = express();

setupApp(app);

app.get('/api/mango', (req, res) => {
  res.send('mango');
});

module.exports = app;
