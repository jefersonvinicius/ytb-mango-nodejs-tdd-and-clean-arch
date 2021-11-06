const jwt = require('jsonwebtoken');
const MissingParamError = require('../errors/missing-param-error');

module.exports = class TokenGenerator {
  constructor(secret) {
    if (!secret) throw new MissingParamError('secret');
    this.secret = secret;
  }

  async generate(id) {
    if (!id) throw new MissingParamError('id');
    return jwt.sign({ _id: id }, this.secret);
  }
};
