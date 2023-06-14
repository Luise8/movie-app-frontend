module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/test-config/mocks/file-mock.js',
    '\\.(css|less)$': '<rootDir>/test-config/mocks/styles-mock.js',
    '^src/(.*)$': '<rootDir>/src/$1',
  },

};
