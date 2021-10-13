module.exports = {
  preset: '@shelf/jest-mongodb',
  collectCoverage: false,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  watchPathIgnorePatterns: ['globalConfig'],
};
