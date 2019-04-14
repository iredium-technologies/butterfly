module.exports = {
  'testEnvironment': 'node',
  'verbose': true,
  'forceExit': true,
  'testMatch': [ '**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)' ],
  'transform': {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.(ts|tsx)$': '<rootDir>/ts_jest.js'
  },
  'globals': {
    'NODE_ENV': 'test'
  },
  'moduleFileExtensions': [
    'ts',
    'tsx',
    'js',
    'jsx',
    'json',
    'node'
  ],
  'moduleDirectories': [
    'node_modules',
    'build'
  ],
  'moduleNameMapper': {
    '^~/src/(.*)': '<rootDir>/src/$1',
    '^~/test/(.*)': '<rootDir>/test/$1',
    '^~/example/(.*)': '<rootDir>/example/$1'
  }
}
