module.exports = {
  projects: [
    {
      displayName: 'api',
      testEnvironment: 'node',
      preset: 'ts-jest',
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
      },
      testMatch: ['<rootDir>/src/tests/api/**/*.test.ts'],
      transformIgnorePatterns: ['/node_modules/(?!(bcrypt)/)'],
    },
    {
      displayName: 'lib',
      testEnvironment: 'node',
      preset: 'ts-jest',
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
      },
      testMatch: ['<rootDir>/src/tests/lib/**/*.test.ts'],
    },
    {
      displayName: 'components',
      testEnvironment: 'jsdom',
      preset: 'ts-jest',
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
      },
      testMatch: ['<rootDir>/src/tests/components/**/*.test.tsx'],
      setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'],
      transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: { jsx: 'react-jsx' } }],
      },
    },
  ],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['/node_modules/', '/tests/'],
}
