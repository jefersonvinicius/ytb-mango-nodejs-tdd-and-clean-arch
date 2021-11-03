const sut = require('./mongo-helper');

describe('MongoHelper', () => {
  afterAll(async () => {
    await sut.disconnect();
  });

  it('should connect when getCollection() is called even when database is disconnected', async () => {
    await sut.connect(global.__MONGO_URI__);
    expect(sut.db).toBeTruthy();

    await sut.disconnect();
    expect(sut.db).toBeNull();

    await sut.getCollection('users');
    expect(sut.db).toBeDefined();
  });
});
