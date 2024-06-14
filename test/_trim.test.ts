import {
	_str,
	_trim,
} from '../lib';

//npm run test -- _trim.test.ts
describe('_trim', () => {
	it('should trim default whitespace characters from both ends of the string', () => {
		expect(_trim('  Hello World  ')).toBe('Hello World');
		expect(_str('  Hello World  ', true)).toBe('Hello World');
	});

	it('should trim specified characters from both ends of the string, including zero-width spaces', () => {
		expect(_trim('\u200B\u200CHello World\u200B\u200C')).toBe('Hello World');
		expect(_str('\u200B\u200CHello World\u200B\u200C', true)).toBe('Hello World');
	});

	it('should trim specified characters from both ends of the string', () => {
		expect(_trim('---Hello World---', '-')).toBe('Hello World');
	});

	it('should trim default whitespace characters from the left end of the string', () => {
		expect(_trim('  Hello World  ', undefined, 'l')).toBe('Hello World  ');
	});

	it('should trim default whitespace characters from the right end of the string', () => {
		expect(_trim('  Hello World  ', undefined, 'r')).toBe('  Hello World');
	});

	it('should trim specified characters from the left end of the string', () => {
		expect(_trim('---Hello World---', '-', 'left')).toBe('Hello World---');
	});

	it('should trim specified characters from the right end of the string', () => {
		expect(_trim('---Hello World---', '-', 'right')).toBe('---Hello World');
	});

	it('should trim zero-width whitespace characters from both ends of the string', () => {
		expect(_trim('\u200BHello World\u200B')).toBe('Hello World');
	});

	it('should trim zero-width whitespace characters from the left end of the string', () => {
		expect(_trim('\u200BHello World', undefined, 'l')).toBe('Hello World');
	});

	it('should trim zero-width whitespace characters from the right end of the string', () => {
		expect(_trim('Hello World\u200B', undefined, 'r')).toBe('Hello World');
	});

	it('should return the original string if no characters are specified for trimming', () => {
		expect(_trim('Hello World', '')).toBe('Hello World');
	});

	it('should handle empty strings correctly', () => {
		expect(_trim('')).toBe('');
	});

	it('should handle non-string inputs by converting them to strings', () => {
		expect(_trim(12345)).toBe('12345');
		expect(_trim(null)).toBe('');
		expect(_trim(undefined)).toBe('');
	});

	it('should handle custom trimming characters that include special characters', () => {
		expect(_trim('---Hello World---', '-')).toBe('Hello World');
		expect(_trim('_Hello World_', '_')).toBe('Hello World');
		expect(_trim('-_Hello World_-', '-_')).toBe('Hello World');
	});
});