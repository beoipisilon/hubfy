const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    testEnvironment: 'node',
    testEnvironmentOptions: {
        customExportConditions: [''],
    },
    transformIgnorePatterns: [
        'node_modules/(?!(next)/)',
    ],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    collectCoverageFrom: [
        'src/**/*.{js,jsx,ts,tsx}',
        '!src/**/*.d.ts',
        '!src/**/*.stories.{js,jsx,ts,tsx}',
        '!src/**/__tests__/**',
    ],
    coverageThreshold: {
        global: {
            branches: 60,
            functions: 60,
            lines: 60,
            statements: 60,
        },
    },
    testMatch: [
        '**/__tests__/**/*.[jt]s?(x)',
        '**/?(*.)+(spec|test).[jt]s?(x)',
    ],
    globals: {
        'ts-jest': {
            tsconfig: {
                jsx: 'react',
            },
        },
    },
}

module.exports = createJestConfig(customJestConfig)

