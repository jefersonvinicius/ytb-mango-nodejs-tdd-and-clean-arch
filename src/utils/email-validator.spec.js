const EmailValidator = require('./email-validator');
const validator = require('validator');

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
});
