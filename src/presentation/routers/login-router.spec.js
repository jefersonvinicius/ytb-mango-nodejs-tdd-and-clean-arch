const MissingParamError = require('../helpers/missing-param-error');
const LoginRouter = require('./login-router');

describe('Login Router', () => {
  it('Should return 400 if no email was provided', () => {
    const sut = new LoginRouter();
    const httpRequest = {
      body: {
        password: 'any_password',
      },
    };
    const httpResponse = sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('email'));
  });

  it('Should return 400 if no password was provided', () => {
    const sut = new LoginRouter();
    const httpRequest = {
      body: {
        email: 'any_email@email.com',
      },
    };
    const httpResponse = sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('password'));
  });

  it('Should return 500 if no httpRequest was provided', () => {
    const sut = new LoginRouter();
    const httpResponse = sut.route();
    expect(httpResponse.statusCode).toBe(500);
  });

  it('Should return 500 if no httpRequest body was provided', () => {
    const sut = new LoginRouter();
    const httpResponse = sut.route({});
    expect(httpResponse.statusCode).toBe(500);
  });
});
