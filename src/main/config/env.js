module.exports = {
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:4343/clean-node-api',
  tokenSecret: process.env.TOKEN_SECRET || 'secret',
  port: process.env.PORT || 5959,
};
