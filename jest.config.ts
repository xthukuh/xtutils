import type { Config } from 'jest';

const config: Config = {
	verbose: true,
	preset: 'ts-jest',
	testEnvironment: 'node',
	roots: ['<rootDir>/lib'],
	transform: {
		'^.+\\.ts?$': 'ts-jest',
	},
};

export default config;