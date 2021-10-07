const bcrypt = require('../../../__mocks__/bcrypt');
const Encrypter = require('./encrypter');

describe('Encrypter', () => {
  it('should return true if bcrypt returns true', async () => {
    const sut = new Encrypter();
    const isValid = await sut.compare('any_value', 'hashed_value');
    expect(isValid).toBe(true);
  });

  it('should return false if bcrypt returns false', async () => {
    const sut = new Encrypter();
    bcrypt.isValid = false;
    const isValid = await sut.compare('any_value', 'hashed_value');
    expect(isValid).toBe(false);
  });
});
