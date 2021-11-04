const app = require('./app');
const MongoHelper = require('../infra/helpers/mongo-helper');

const env = require('./config/env');

MongoHelper.connect(env.mongoUrl)
  .then(() => {
    app.listen(env.port, () => {
      console.log(`Server running at http://localhost:${env.port}`);
    });
  })
  .catch(console.error);
