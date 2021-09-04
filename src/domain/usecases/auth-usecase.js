const MissingParamError = require('../../utils/errors/missing-param-error');

module.exports = class AuthUseCase {
  constructor({ loadUserByEmailRepository, encrypter, tokenGenerator }) {
    this.loadUserByEmailRepository = loadUserByEmailRepository;
    this.encrypter = encrypter;
    this.tokenGenerator = tokenGenerator;
  }

  async auth(email, password) {
    if (!email) throw new MissingParamError('email');
    if (!password) throw new MissingParamError('password');

    const user = await this.loadUserByEmailRepository.load(email);
    if (!user) return null;

    const isValid = await this.encrypter.compare(password, user.password);
    if (!isValid) return null;

    return await this.tokenGenerator.generate(user.id);
  }
};
