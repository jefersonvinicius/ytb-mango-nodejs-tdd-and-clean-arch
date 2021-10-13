const { MongoClient } = require('mongodb');

class LoadUserByEmailRepository {
  constructor(userModel) {
    this.userModel = userModel;
  }

  async load(email) {
    return await this.userModel.findOne({ email });
  }
}

describe('LoadUserByEmail Repository', () => {
  let client, db;

  beforeAll(async () => {
    client = await MongoClient.connect(global.__MONGO_URI__);
    db = client.db();
  });

  afterAll(async () => {
    await client.close();
  });

  it('should returns null when user is"nt found', async () => {
    const userModel = db.collection('users');
    const sut = new LoadUserByEmailRepository(userModel);
    const user = await sut.load('invalid@gmail.com');
    expect(user).toBeNull();
  });

  it('should returns an if user is found', async () => {
    const userModel = db.collection('users');
    await userModel.insertOne({
      email: 'any@gmail.com',
    });

    const sut = new LoadUserByEmailRepository(userModel);
    const user = await sut.load('any@gmail.com');
    expect(user.email).toBe('any@gmail.com');
  });
});
