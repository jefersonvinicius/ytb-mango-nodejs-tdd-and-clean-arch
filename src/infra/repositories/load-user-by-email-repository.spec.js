const { MongoClient } = require('mongodb');

let client, db;

class LoadUserByEmailRepository {
  constructor(userModel) {
    this.userModel = userModel;
  }

  async load(email) {
    return await this.userModel.findOne({ email });
  }
}

function makeSut() {
  const userModel = db.collection('users');
  const sut = new LoadUserByEmailRepository(userModel);
  return { sut, userModel };
}

describe('LoadUserByEmail Repository', () => {
  beforeAll(async () => {
    client = await MongoClient.connect(global.__MONGO_URI__);
    db = client.db();
  });

  beforeEach(async () => {
    await db.collection('users').deleteMany();
  });

  afterAll(async () => {
    await client.close();
  });

  it('should returns null when user is"nt found', async () => {
    const { sut } = makeSut();
    const user = await sut.load('invalid@gmail.com');
    expect(user).toBeNull();
  });

  it('should returns an user if user is found', async () => {
    const { sut, userModel } = makeSut();

    const insertion = await userModel.insertOne({
      email: 'any@gmail.com',
      name: 'any_name',
      password: 'hashed',
    });

    const user = await sut.load('any@gmail.com');

    expect(user).toMatchObject({
      _id: insertion.insertedId,
      name: 'any_name',
      password: 'hashed',
    });
  });
});
