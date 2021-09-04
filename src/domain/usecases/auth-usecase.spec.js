const MissingParamError = require('../../utils/errors/missing-param-error');
const AuthUseCase = require('./auth-usecase');

function makeEncrypter() {
  class EncrypterSpy {
    async compare(password, hashedPassword) {
      this.password = password;
      this.hashedPassword = hashedPassword;
      return this.isValid;
    }
  }
  const encrypterSpy = new EncrypterSpy();
  encrypterSpy.isValid = true;

  return encrypterSpy;
}

function makeLoadUserByEmailRepository() {
  class LoadUserByEmailRepository {
    async load(email) {
      this.email = email;
      return this.user;
    }
  }
  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepository();
  loadUserByEmailRepositorySpy.user = {
    id: 'any_id',
    password: 'hashed_password',
  };
  return loadUserByEmailRepositorySpy;
}

function makeTokenGenerator() {
  class TokenGeneratorSpy {
    async generate(userId) {
      this.userId = userId;
      return this.accessToken;
    }
  }
  const tokenGeneratorSpy = new TokenGeneratorSpy();
  tokenGeneratorSpy.accessToken = 'any_token';
  return tokenGeneratorSpy;
}

function makeSut() {
  const encrypterSpy = makeEncrypter();
  const loadUserByEmailRepositorySpy = makeLoadUserByEmailRepository();
  const tokenGeneratorSpy = makeTokenGenerator();
  const sut = new AuthUseCase(loadUserByEmailRepositorySpy, encrypterSpy, tokenGeneratorSpy);
  return { sut, loadUserByEmailRepositorySpy, encrypterSpy, tokenGeneratorSpy };
}

describe('Auth UseCase', () => {
  it('Should throw if no email is provided', async () => {
    const { sut } = makeSut();
    const promise = sut.auth();
    expect(promise).rejects.toThrow(new MissingParamError('email'));
  });

  it('Should throw if no password is provided', async () => {
    const { sut } = makeSut();
    const promise = sut.auth('any_email@gmail.com');
    expect(promise).rejects.toThrow(new MissingParamError('password'));
  });

  it('Should call LoadUserByEmailRepository with correct email', async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut();
    await sut.auth('any_email@gmail.com', 'any_password');
    expect(loadUserByEmailRepositorySpy.email).toBe('any_email@gmail.com');
  });

  it('Should throw error if no LoadUserByEmailRepository is provided', async () => {
    const sut = new AuthUseCase();
    const promise = sut.auth('any_email@gmail.com', 'any_password');
    expect(promise).rejects.toThrow();
  });

  it('Should throw error if LoadUserByEmailRepository has no method', async () => {
    const sut = new AuthUseCase({});
    const promise = sut.auth('any_email@gmail.com', 'any_password');
    expect(promise).rejects.toThrow();
  });

  it('Should return null if invalid email is provided', async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut();
    loadUserByEmailRepositorySpy.user = null;
    const accessToken = await sut.auth('invalid@gmail.com', 'any_password');
    expect(accessToken).toBeNull();
  });

  it('Should return null if invalid password is provided', async () => {
    const { sut, encrypterSpy } = makeSut();
    encrypterSpy.isValid = false;
    const accessToken = await sut.auth('any@gmail.com', 'invalid_password');
    expect(accessToken).toBeNull();
  });

  it('Should call Encrypter with correct values', async () => {
    const { sut, loadUserByEmailRepositorySpy, encrypterSpy } = makeSut();
    await sut.auth('any@gmail.com', 'any_password');
    expect(encrypterSpy.password).toBe('any_password');
    expect(encrypterSpy.hashedPassword).toBe(loadUserByEmailRepositorySpy.user.password);
  });

  it('Should call TokenGenerator with correct userId', async () => {
    const { sut, loadUserByEmailRepositorySpy, tokenGeneratorSpy } = makeSut();
    await sut.auth('any@gmail.com', 'any_password');
    expect(tokenGeneratorSpy.userId).toBe(loadUserByEmailRepositorySpy.user.id);
  });
});
