const bcrypt = require('../../../__mocks__/bcrypt');
const Encrypter = require('./encrypter');
const MissingParamError = require('../errors/missing-param-error');

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

  it('should call bcrypt with correct values', async () => {
    const sut = new Encrypter();
    await sut.compare('any_value', 'hashed_value');
    expect(bcrypt.value).toBe('any_value');
    expect(bcrypt.hash).toBe('hashed_value');
  });

  it('should to throw an error when no params are provided', async () => {
    expect.assertions(2);

    const sut = new Encrypter();
    let promise = sut.compare();
    await expect(promise).rejects.toThrow(new MissingParamError('value'));

    promise = sut.compare('value');
    await expect(promise).rejects.toThrow(new MissingParamError('hash'));
  });
});
