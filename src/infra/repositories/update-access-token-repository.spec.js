const MongoHelper = require('../helpers/mongo-helper');

class UpdateAccessTokenRepository {
  constructor(userModel) {
    this.userModel = userModel;
  }

  async update(userId, accessToken) {
    await this.userModel.updateOne({ _id: userId }, { $set: { accessToken } });
  }
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
    const userModel = db.collection('users');
    const insertion = await userModel.insertOne({
      email: 'any@gmail.com',
      name: 'any_name',
      password: 'hashed',
    });
    const sut = new UpdateAccessTokenRepository(userModel);

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
});
