const InvalidParamError = require('../helpers/invalid-param-error');
const MissingParamError = require('../helpers/missing-param-error');
const ServerError = require('../helpers/server-error');
const UnauthorizedError = require('../helpers/unauthorized-error');
const LoginRouter = require('./login-router');

function makeSut() {
  const authUseCaseSpy = makeAuthUseCase();
  const emailValidator = makeEmailValidator();
  const sut = new LoginRouter(authUseCaseSpy, emailValidator);
  return { sut, authUseCaseSpy, emailValidator };
}

function makeEmailValidator() {
  class EmailValidatorSpy {
    isValid(_) {
      return this.isEmailValid;
    }
  }
  const emailValidator = new EmailValidatorSpy();
  emailValidator.isEmailValid = true;
  return emailValidator;
}

function makeAuthUseCase() {
  class AuthUseCaseSpy {
    async auth(email, password) {
      Object.assign(this, { email, password });
      return this.accessToken;
    }
  }
  const authUseCaseSpy = new AuthUseCaseSpy();
  authUseCaseSpy.accessToken = 'valid_token';
  return authUseCaseSpy;
}

function makeAuthUseCaseWithError() {
  class AuthUseCaseSpy {
    async auth() {
      throw new Error();
    }
  }
  return new AuthUseCaseSpy();
}

function makeEmailValidatorWithError() {
  class EmailValidatorSpy {
    isValid(_) {
      throw Error();
    }
  }
  const emailValidator = new EmailValidatorSpy();
  return emailValidator;
}

describe('Login Router', () => {
  it('Should return 400 if no email was provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        password: 'any_password',
      },
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('email'));
  });

  it('Should return 400 if no password was provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'any_email@email.com',
      },
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('password'));
  });

  it('Should return 500 if no httpRequest was provided', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.route();
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  it('Should return 500 if no httpRequest body was provided', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.route({});
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  it('Should call AuthUseCase with correct params', async () => {
    const { sut, authUseCaseSpy } = makeSut();
    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password',
      },
    };
    await sut.route(httpRequest);
    expect(authUseCaseSpy.email).toBe(httpRequest.body.email);
    expect(authUseCaseSpy.password).toBe(httpRequest.body.password);
  });

  it('Should return 401 when invalid credentials are provided', async () => {
    const { sut, authUseCaseSpy } = makeSut();
    authUseCaseSpy.accessToken = null;
    const httpRequest = {
      body: {
        email: 'invalid_email@email.com',
        password: 'invalid_password',
      },
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(401);
    expect(httpResponse.body).toEqual(new UnauthorizedError());
  });

  it('Should return 200 when valid credentials are provided', async () => {
    const { sut, authUseCaseSpy } = makeSut();
    const httpRequest = {
      body: {
        email: 'valid_email@email.com',
        password: 'valid_password',
      },
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body.accessToken).toEqual(authUseCaseSpy.accessToken);
  });

  it('Should return 500 if not authUseCase was provided', async () => {
    const sut = new LoginRouter();
    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password',
      },
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  it('Should return 500 if authUseCase don`t has auth method', async () => {
    const sut = new LoginRouter({});
    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password',
      },
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  it('Should return 500 if authUseCase throws a exception', async () => {
    const authUseCaseWithError = makeAuthUseCaseWithError();
    const sut = new LoginRouter(authUseCaseWithError);
    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password',
      },
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
  });

  it('Should return 400 if email provided is invalid', async () => {
    const { sut, emailValidator } = makeSut();
    emailValidator.isEmailValid = false;
    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password',
      },
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError('email'));
  });

  it('Should return 500 if not EmailValidator was provided', async () => {
    const authUseCaseSpy = makeAuthUseCase();
    const sut = new LoginRouter(authUseCaseSpy);
    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password',
      },
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  it('Should return 500 if EmailValidator has no isValid method', async () => {
    const authUseCaseSpy = makeAuthUseCase();
    const sut = new LoginRouter(authUseCaseSpy, {});
    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password',
      },
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  it('Should return 500 if EmailValidator throws an exception', async () => {
    const authUseCaseSpy = makeAuthUseCase();
    const emailValidatorSpy = makeEmailValidatorWithError();
    const sut = new LoginRouter(authUseCaseSpy, emailValidatorSpy);
    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password',
      },
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });
});
