const MissingParamError = require('../../utils/errors/missing-param-error');
const MongoHelper = require('../helpers/mongo-helper');
const UpdateAccessTokenRepository = require('./update-access-token-repository');

function makeSut() {
  const sut = new UpdateAccessTokenRepository();
  return { sut };
}

let userModel;

describe('UpdateAccessToken Repository', () => {
  let userIdInserted;

  beforeAll(async () => {
    await MongoHelper.connect(global.__MONGO_URI__);
    userModel = await MongoHelper.getCollection('users');
  });

  beforeEach(async () => {
    await userModel.deleteMany();
    const insertion = await userModel.insertOne({
      email: 'any@gmail.com',
      name: 'any_name',
      password: 'hashed',
    });
    userIdInserted = insertion.insertedId;
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  it('should update the user with the given accessToken', async () => {
    const { sut } = makeSut();

    await sut.update(userIdInserted, 'valid_token');

    const updatedUser = await userModel.findOne({ _id: userIdInserted });
    expect(updatedUser.accessToken).toBe('valid_token');
  });

  it('should throw an error if no params are provided', async () => {
    const { sut } = makeSut();

    await expect(sut.update()).rejects.toThrow(new MissingParamError('userId'));
    await expect(sut.update(userIdInserted)).rejects.toThrow(new MissingParamError('accessToken'));
  });
});
