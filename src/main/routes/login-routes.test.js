const supertest = require('supertest');
const MongoHelper = require('../../infra/helpers/mongo-helper');
const bcrypt = require('bcrypt');
const app = require('../app');

const request = supertest(app);

describe('Login Routes', () => {
  let userModel;

  beforeAll(async () => {
    await MongoHelper.connect(global.__MONGO_URI__);
    userModel = await MongoHelper.getCollection('users');
  });

  beforeEach(async () => {
    await userModel.deleteMany();
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  it('should return 200 when valid credentials are provided', async () => {
    await userModel.insertOne({
      email: 'valid_email@gmail.com',
      password: bcrypt.hashSync('hashed_password', 10),
    });
    const response = await request.post('/api/login').send({
      email: 'valid_email@gmail.com',
      password: 'hashed_password',
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('accessToken', expect.any(String));
  });

  it('should return 401 when invalid credentials are provided', async () => {
    await request
      .post('/api/login')
      .send({
        email: 'valid_email@gmail.com',
        password: 'hashed_password',
      })
      .expect(401);
  });
});
