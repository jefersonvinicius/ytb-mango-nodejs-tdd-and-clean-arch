const InvalidParamError = require('../../utils/errors/invalid-param-error');
const MissingParamError = require('../../utils/errors/missing-param-error');
const ServerError = require('../errors/server-error');
const UnauthorizedError = require('../errors/unauthorized-error');
const LoginRouter = require('./login-router');

function makeSut() {
  const authUseCaseSpy = makeAuthUseCase();
  const emailValidator = makeEmailValidator();
  const sut = new LoginRouter({ authUseCase: authUseCaseSpy, emailValidator });
  return { sut, authUseCaseSpy, emailValidator };
}

function makeEmailValidator() {
  class EmailValidatorSpy {
    isValid(email) {
      this.email = email;
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
    expect(httpResponse.body.error).toBe(new MissingParamError('email').message);
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
    expect(httpResponse.body.error).toBe(new MissingParamError('password').message);
  });

  it('Should return 500 if no httpRequest was provided', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.route();
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body.error).toBe(new ServerError().message);
  });

  it('Should return 500 if no httpRequest body was provided', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.route({});
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body.error).toBe(new ServerError().message);
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
    expect(httpResponse.body.error).toBe(new UnauthorizedError().message);
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
    expect(httpResponse.body.error).toBe(new InvalidParamError('email').message);
  });

  it('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidator } = makeSut();
    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password',
      },
    };
    await sut.route(httpRequest);
    expect(emailValidator.email).toBe(httpRequest.body.email);
  });

  it('Should throw error if invalid dependencies are provided', async () => {
    const invalid = {};
    const authUseCase = makeAuthUseCase();
    const suts = [
      new LoginRouter(),
      new LoginRouter({}),
      new LoginRouter({ authUseCase: invalid }),
      new LoginRouter({ authUseCase: authUseCase }),
      new LoginRouter({ authUseCase: authUseCase, emailValidator: invalid }),
    ];

    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password',
      },
    };

    for (const sut of suts) {
      const httpResponse = await sut.route(httpRequest);
      expect(httpResponse.statusCode).toBe(500);
      expect(httpResponse.body.error).toBe(new ServerError().message);
    }
  });

  it('should throw an error when some dependency throws an error', async () => {
    const authUseCaseWithError = makeAuthUseCaseWithError();
    const authUseCase = makeAuthUseCase();
    const emailValidatorWithError = makeEmailValidatorWithError();
    const emailValidator = makeEmailValidator();

    const suts = [
      new LoginRouter({
        authUseCase: authUseCaseWithError,
        emailValidator,
      }),
      new LoginRouter({
        authUseCase,
        emailValidator: emailValidatorWithError,
      }),
    ];

    for (const sut of suts) {
      const httpRequest = {
        body: {
          email: 'any_email@email.com',
          password: 'any_password',
        },
      };
      const httpResponse = await sut.route(httpRequest);
      expect(httpResponse.statusCode).toBe(500);
      expect(httpResponse.body.error).toBe(new ServerError().message);
    }
  });
});
