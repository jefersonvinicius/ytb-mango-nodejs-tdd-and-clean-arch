const InvalidParamError = require('../../utils/errors/invalid-param-error');
const MissingParamError = require('../../utils/errors/missing-param-error');

class AuthUseCase {
  constructor(loadUserByEmailRepository) {
    this.loadUserByEmailRepository = loadUserByEmailRepository;
  }

  async auth(email, password) {
    if (!email) throw new MissingParamError('email');
    if (!password) throw new MissingParamError('password');
    if (!this.loadUserByEmailRepository) throw new MissingParamError('loadUserByEmailRepository');
    if (!this.loadUserByEmailRepository.load) throw new InvalidParamError('loadUserByEmailRepository');
    const user = await this.loadUserByEmailRepository.load(email);
    if (!user) return null;
  }
}

function makeSut() {
  class LoadUserByEmailRepository {
    async load(email) {
      this.email = email;
    }
  }
  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepository();
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
    expect(promise).rejects.toThrow(new MissingParamError('loadUserByEmailRepository'));
  });

  it('Should throw error if LoadUserByEmailRepository has no method', async () => {
    const sut = new AuthUseCase({});
    const promise = sut.auth('any_email@gmail.com', 'any_password');
    expect(promise).rejects.toThrow(new InvalidParamError('loadUserByEmailRepository'));
  });

  it('Should return null if LoadUserByEmailRepository returns null', async () => {
    const { sut } = makeSut();
    const accessToken = await sut.auth('invalid@gmail.com', 'any_password');
    expect(accessToken).toBeNull();
  });
});
