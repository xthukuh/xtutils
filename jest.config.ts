import type { Config } from 'jest';

const config: Config = {
	verbose: true,
	preset: 'ts-jest',
	testEnvironment: 'node',
	moduleFileExtensions: ['ts', 'js'],
	roots: [
		'<rootDir>/test',
	],
	testMatch: [
		'**/*.test.ts',
		// '**/_promise.test.ts',
		// '**/_string.test.ts',
		// '**/_temp.xx.test.ts',
	],
	transform: {
		'^.+\\.ts?$': 'ts-jest',
	},
};

export default config;