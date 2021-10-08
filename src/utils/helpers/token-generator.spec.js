const jsonwebtoken = require('../../../__mocks__/jsonwebtoken');
const TokenGenerator = require('./token-generator');

describe('Token Generator', () => {
  it('should return null if JWT returns null', async () => {
    const sut = new TokenGenerator();
    jsonwebtoken.token = null;
    const token = await sut.generate('any_id');
    expect(token).toBeNull();
  });

  it('should return a token if JWT returns a token', async () => {
    const sut = new TokenGenerator();
    const token = await sut.generate('any_id');
    expect(token).toBe(jsonwebtoken.token);
  });

  it('should call JWT with correct values', async () => {
    const sut = new TokenGenerator('secret');
    await sut.generate('any_id');
    expect(jsonwebtoken.id).toBe('any_id');
    expect(jsonwebtoken.secret).toBe('secret');
  });
});
