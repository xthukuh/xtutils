import { _isDate } from '../lib/utils/_datetime';

describe('_isDate', () => {
	it('should return true for valid Date instance', () => {
		expect(_isDate(new Date())).toBe(true);
	});

	it('should return false for invalid Date instance', () => {
		expect(_isDate(new Date('invalid'))).toBe(false);
	});

	it('should return false for non-Date values', () => {
		expect(_isDate('2022-01-01')).toBe(false);
		expect(_isDate(1640995200000)).toBe(false);
		expect(_isDate(null)).toBe(false);
		expect(_isDate(undefined)).toBe(false);
		expect(_isDate(true)).toBe(false);
		expect(_isDate(0)).toBe(false);
		expect(_isDate({})).toBe(false);
		expect(_isDate([])).toBe(false);
	});
});




