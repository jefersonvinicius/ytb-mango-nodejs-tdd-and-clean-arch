module.exports = {
  isValid: true,
  value: undefined,
  hash: undefined,
  async compare(value, hash) {
    this.value = value;
    this.hash = hash;
    return this.isValid;
  },
};
