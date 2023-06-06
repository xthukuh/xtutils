import type { Config } from 'jest';

const config: Config = {
	verbose: true,
	preset: 'ts-jest',
	testEnvironment: 'node',
	moduleFileExtensions: ['ts', 'js'],
	roots: ['<rootDir>/lib'],
	testMatch: ['**/*.test.ts'],
	transform: {
		'^.+\\.ts?$': 'ts-jest',
	},
};

export default config;