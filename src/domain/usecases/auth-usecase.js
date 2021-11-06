const MissingParamError = require('../../utils/errors/missing-param-error');

module.exports = class AuthUseCase {
  constructor({ loadUserByEmailRepository, encrypter, tokenGenerator, updateAccessTokenRepository } = {}) {
    this.loadUserByEmailRepository = loadUserByEmailRepository;
    this.encrypter = encrypter;
    this.tokenGenerator = tokenGenerator;
    this.updateAccessTokenRepository = updateAccessTokenRepository;
  }

  async auth(email, password) {
    if (!email) throw new MissingParamError('email');
    if (!password) throw new MissingParamError('password');

    const user = await this.loadUserByEmailRepository.load(email);
    if (!user) return null;

    const isValid = await this.encrypter.compare(password, user.password);
    if (!isValid) return null;

    console.log(user);
    const accessToken = await this.tokenGenerator.generate(user._id);
    await this.updateAccessTokenRepository.update(user._id, accessToken);

    return accessToken;
  }
};
