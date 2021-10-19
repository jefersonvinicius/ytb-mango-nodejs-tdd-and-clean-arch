const MissingParamError = require('../../utils/errors/missing-param-error');
const MongoHelper = require('../helpers/mongo-helper');
const UpdateAccessTokenRepository = require('./update-access-token-repository');

function makeSut() {
  const userModel = db.collection('users');
  const sut = new UpdateAccessTokenRepository(userModel);
  return { sut, userModel };
}

let db;

describe('UpdateAccessToken Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(global.__MONGO_URI__);
    db = await MongoHelper.getDB();
  });

  beforeEach(async () => {
    await db.collection('users').deleteMany();
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  it('should update the user with the given accessToken', async () => {
    const { sut, userModel } = makeSut();
    const insertion = await userModel.insertOne({
      email: 'any@gmail.com',
      name: 'any_name',
      password: 'hashed',
    });

    await sut.update(insertion.insertedId, 'valid_token');

    const updatedUser = await userModel.findOne({ _id: insertion.insertedId });
    expect(updatedUser.accessToken).toBe('valid_token');
  });

  it('should throw an error if no userModel is provided', async () => {
    const userModel = db.collection('users');
    const insertion = await userModel.insertOne({
      email: 'any@gmail.com',
      name: 'any_name',
      password: 'hashed',
    });

    const sut = new UpdateAccessTokenRepository();

    const promise = sut.update(insertion.insertedId, 'valid_token');
    await expect(promise).rejects.toThrow();
  });

  it('should throw an error if no params are provided', async () => {
    const { sut, userModel } = makeSut();
    const insertion = await userModel.insertOne({
      email: 'any@gmail.com',
      name: 'any_name',
      password: 'hashed',
    });

    await expect(sut.update()).rejects.toThrow(new MissingParamError('userId'));
    await expect(sut.update(insertion.insertedId)).rejects.toThrow(new MissingParamError('accessToken'));
  });
});
