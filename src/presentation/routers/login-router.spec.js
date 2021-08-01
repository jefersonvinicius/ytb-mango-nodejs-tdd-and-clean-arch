class LoginRouter {
  route(httpRequest) {
    if (!httpRequest || !httpRequest.body) {
      return {
        statusCode: 500,
      };
    }

    const { email, password } = httpRequest.body;
    if (!email || !password) {
      return {
        statusCode: 400,
      };
    }
  }
}

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
