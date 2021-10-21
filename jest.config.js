module.exports = {
  preset: '@shelf/jest-mongodb',
  collectCoverage: false,
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['**/src/**/*.js', '!**/src/main/**/index.js'],
  coverageProvider: 'v8',
  watchPathIgnorePatterns: ['globalConfig'],
};
