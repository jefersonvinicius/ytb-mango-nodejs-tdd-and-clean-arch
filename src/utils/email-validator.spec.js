const EmailValidator = require('./email-validator');
const validator = require('validator');
const MissingParamError = require('./errors/missing-param-error');

function makeSut() {
  return new EmailValidator();
}

describe('Email Validator', () => {
  it('Should return true if validator returns true', () => {
    const sut = makeSut();
    const isEmailValid = sut.isValid('valid_email@gmail.com');
    expect(isEmailValid).toBe(true);
  });

  it('Should return true if validator returns true', () => {
    validator.isEmailValid = false;
    const sut = makeSut();
    const isEmailValid = sut.isValid('invalid_email');
    expect(isEmailValid).toBe(false);
  });

  it('Should call validator with correct email', () => {
    const sut = makeSut();
    sut.isValid('any_email@gmail.com');
    expect(validator.email).toBe('any_email@gmail.com');
  });

  it('should to throw an error when no params are provided', async () => {
    expect.assertions(1);
    const sut = makeSut();
    expect(() => sut.isValid()).toThrow(new MissingParamError('email'));
  });
});
