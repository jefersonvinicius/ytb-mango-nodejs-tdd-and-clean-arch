const sut = require('./mongo-helper');

describe('MongoHelper', () => {
  afterAll(async () => {
    await sut.disconnect();
  });

  it('should getDb() return a value even when database is disconnected', async () => {
    await sut.connect(global.__MONGO_URI__);
    expect(sut.db).toBeTruthy();

    await sut.disconnect();
    expect(sut.db).toBeNull();

    const db = await sut.getDB();
    expect(db).toBe(sut.db);
  });
});
