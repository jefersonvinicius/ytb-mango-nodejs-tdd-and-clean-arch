const MissingParamError = require('../../utils/errors/missing-param-error');
const AuthUseCase = require('./auth-usecase');

function makeSut() {
  class LoadUserByEmailRepository {
    async load(email) {
      this.email = email;
      return this.user;
    }
  }
  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepository();
  loadUserByEmailRepositorySpy.user = {};
  const sut = new AuthUseCase(loadUserByEmailRepositorySpy);

  return { sut, loadUserByEmailRepositorySpy };
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
    const { sut } = makeSut();
    const accessToken = await sut.auth('any@gmail.com', 'invalid_password');
    expect(accessToken).toBeNull();
  });
});
