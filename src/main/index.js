const app = require('./app');
const MongoHelper = require('../infra/helpers/mongo-helper');

const env = require('./config/env');

MongoHelper.connect(env.mongoUrl)
  .then(() => {
    app.listen(5959, () => {
      console.log('Server Running');
    });
  })
  .catch(console.error);
