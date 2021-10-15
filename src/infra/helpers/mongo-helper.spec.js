const MongoHelper = require('./mongo-helper');

describe('MongoHelper', () => {
  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  it('should getDb() return a value even when database is disconnected', async () => {
    const sut = MongoHelper;
    await sut.connect(global.__MONGO_URI__);
    expect(sut.db).toBeTruthy();

    await sut.disconnect();
    expect(sut.db).toBeNull();

    await expect(sut.getDB()).resolves.toBeTruthy();
  });
});
