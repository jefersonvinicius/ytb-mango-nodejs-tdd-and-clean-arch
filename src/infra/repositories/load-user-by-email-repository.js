const MissingParamError = require('../../utils/errors/missing-param-error');
const MongoHelper = require('../helpers/mongo-helper');

module.exports = class LoadUserByEmailRepository {
  async load(email) {
    if (!email) throw new MissingParamError('email');

    const userModel = await MongoHelper.getCollection('users');

    return await userModel.findOne({ email });
  }
};
