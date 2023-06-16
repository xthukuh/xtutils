import { _sayHello } from '../lib';
import { _expectTests } from './__helpers';

//_sayHello
describe('_sayHello: (name?:string) => string', () => {
	const _expected2 = '[x] - Hello Martin!';
	const _expected1 = '[x] - Hello Thuku!';
	let consoleLogMock: jest.SpyInstance;

	beforeAll(() => {
		consoleLogMock = jest.spyOn(console, 'log').mockImplementation();
	});
	
	afterAll(() => {
		expect(consoleLogMock).toHaveBeenCalledTimes(2);
		expect(consoleLogMock.mock.calls).toEqual([[_expected1], [_expected2]]);
		consoleLogMock.mockRestore();
	});

	_expectTests('_sayHello', _sayHello, [
		{
			label: 'with default name',
			code: '',
			args: [],
			expected: _expected1,
		},
		{
			label: 'change default name',
			code: 'Martin',
			args: ['Martin'],
			expected: _expected2,
		},
	]);
});