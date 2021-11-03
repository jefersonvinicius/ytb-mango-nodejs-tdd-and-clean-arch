const MongoHelper = require('../helpers/mongo-helper');
const LoadUserByEmailRepository = require('./load-user-by-email-repository');
const MissingParamError = require('../../utils/errors/missing-param-error');

let db;

function makeSut() {
  const sut = new LoadUserByEmailRepository();
  return { sut };
}

describe('LoadUserByEmail Repository', () => {
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

  it('should returns null when user is"nt found', async () => {
    const { sut } = makeSut();
    const user = await sut.load('invalid@gmail.com');
    expect(user).toBeNull();
  });

  it('should returns an user if user is found', async () => {
    const { sut } = makeSut();

    const insertion = await db.collection('users').insertOne({
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

  it('should throw an error if no email is provided', async () => {
    const { sut } = makeSut();
    const promise = sut.load();
    await expect(promise).rejects.toThrow(new MissingParamError('email'));
  });
});
