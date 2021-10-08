const jwt = require('jsonwebtoken');

module.exports = class TokenGenerator {
  async generate(id) {
    return jwt.sign(id, 'secret');
  }
};
