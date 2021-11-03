const MissingParamError = require('../../utils/errors/missing-param-error');
const mongoHelper = require('../helpers/mongo-helper');

module.exports = class UpdateAccessTokenRepository {
  async update(userId, accessToken) {
    if (!userId) throw new MissingParamError('userId');
    if (!accessToken) throw new MissingParamError('accessToken');

    const db = await mongoHelper.getDB();
    await db.collection('users').updateOne({ _id: userId }, { $set: { accessToken } });
  }
};
