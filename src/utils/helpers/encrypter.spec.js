const Encrypter = require('./encrypter');

describe('Encrypter', () => {
  it('should return true if bcrypt returns true', async () => {
    const sut = new Encrypter();
    const isValid = await sut.compare('any_password', 'hashed_password');
    expect(isValid).toBe(true);
  });
});
