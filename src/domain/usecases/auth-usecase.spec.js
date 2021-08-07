const MissingParamError = require('../../utils/errors/missing-param-error');

class AuthUseCase {
  constructor(loadUserByEmailRepository) {
    this.loadUserByEmailRepository = loadUserByEmailRepository;
  }

  async auth(email, password) {
    if (!email) throw new MissingParamError('email');
    if (!password) throw new MissingParamError('password');
    await this.loadUserByEmailRepository.load(email);
  }
}

describe('Auth UseCase', () => {
  it('Should throw if no email is provided', async () => {
    const sut = new AuthUseCase();
    const promise = sut.auth();
    expect(promise).rejects.toThrow(new MissingParamError('email'));
  });

  it('Should throw if no password is provided', async () => {
    const sut = new AuthUseCase();
    const promise = sut.auth('any_email@gmail.com');
    expect(promise).rejects.toThrow(new MissingParamError('password'));
  });

  it('Should call LoadUserByEmailRepository with correct email', async () => {
    class LoadUserByEmailRepository {
      async load(email) {
        this.email = email;
      }
    }
    const loadUserByEmailRepositorySpy = new LoadUserByEmailRepository();
    const sut = new AuthUseCase(loadUserByEmailRepositorySpy);
    await sut.auth('any_email@gmail.com', 'any_password');
    expect(loadUserByEmailRepositorySpy.email).toBe('any_email@gmail.com');
  });
});
