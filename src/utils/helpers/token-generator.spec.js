jest.mock('jsonwebtoken', () => ({
  token: 'any_token',
  payload: '',
  secret: '',
  sign(payload, secret) {
    this.payload = payload;
    this.secret = secret;
    return this.token;
  },
}));

const jsonwebtoken = require('jsonwebtoken');
const MissingParamError = require('../errors/missing-param-error');
const TokenGenerator = require('./token-generator');

function makeSut() {
  return new TokenGenerator('secret');
}

describe('Token Generator', () => {
  it('should return null if JWT returns null', async () => {
    const sut = makeSut();
    jsonwebtoken.token = null;
    const token = await sut.generate('any_id');
    expect(token).toBeNull();
  });

  it('should return a token if JWT returns a token', async () => {
    const sut = makeSut();
    const token = await sut.generate('any_id');
    expect(token).toBe(jsonwebtoken.token);
  });

  it('should call JWT with correct values', async () => {
    const sut = makeSut();
    await sut.generate('any_id');
    expect(jsonwebtoken.payload).toEqual({ _id: 'any_id' });
    expect(jsonwebtoken.secret).toBe('secret');
  });

  it('should throw if secret isn"t provided', async () => {
    expect(() => {
      new TokenGenerator();
    }).toThrow(new MissingParamError('secret'));
  });

  it('should throw if id isn"t provided', async () => {
    const sut = makeSut();
    const promise = sut.generate();
    await expect(promise).rejects.toThrow(new MissingParamError('id'));
  });
});
