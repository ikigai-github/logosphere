module.exports = {
  displayName: 'fluree-e2e',
  preset: '../../jest.preset.ts',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  testPathIgnorePatterns: [
    '<rootDir>/node_modules',
    '<rootDir>/src/util.spec.ts',
  ],
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/e2e/fluree-e2e',
};
