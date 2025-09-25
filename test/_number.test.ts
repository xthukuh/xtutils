import {
	_deg2rad,
	_rad2deg,
	_distance,
	_round,
	_logx,
	_numk,
	TXColumn,
	_xcolumn,
} from '../lib';

// _deg2rad
describe('\n _deg2rad: (degrees: number) => number', () => {
	it('converts 0 degrees to 0 radians', () => {
		const degrees = 0;
		const radians = _deg2rad(degrees);
		expect(radians).toBe(0);
	});
	it('converts 180 degrees to π radians', () => {
		const degrees = 180;
		const radians = _deg2rad(degrees);
		expect(radians).toBe(Math.PI);
	});
	it('converts -90 degrees to -π/2 radians', () => {
		const degrees = -90;
		const radians = _deg2rad(degrees);
		expect(radians).toBe(-Math.PI / 2);
	});
	it('throws `TypeError` when argument is `NaN`', () => {
		expect(() => _deg2rad('' as any)).toThrow(TypeError);
	});
});

// _rad2deg
describe('\n _rad2deg: (radians: number) => number', () => {
	it('converts 0 radians to 0 degrees', () => {
		const degrees = _rad2deg(0);
		expect(degrees).toBe(0);
	});
	it('converts π radians to 180 degrees', () => {
		const degrees = _rad2deg(Math.PI);
		expect(degrees).toBe(180);
	});
	it('converts -π/2 radians to -90 degrees', () => {
		const degrees = _rad2deg(-Math.PI / 2);
		expect(degrees).toBe(-90);
	});
	it('throws `TypeError` when argument is `NaN`', () => {
		expect(() => _rad2deg('' as any)).toThrow(TypeError);
	});
});

// _distance
describe('_distance: (latitude1: number, longitude1: number, latitude2: number, longitude2: number) => number', () => {
	it('calculates the distance between two known coordinates correctly', () => {
		// The approximate distance between New York City and Los Angeles is 3939 km
		const distance: number = _distance(40.7128, -74.0060, 34.0522, -118.2437);
		expect(distance).toBeCloseTo(3939e3, -100); // Accepts a difference of up to 100 meters
	});
	it('returns 0 when the same coordinates are provided', () => {
		const distance = _distance(51.5074, 0.1278, 51.5074, 0.1278);
		expect(distance).toBe(0);
	});
	it('throws `TypeError` when any argument value is `NaN`', () => {
		expect(() => _distance('' as any, 13.4050, 48.8566, 2.3522)).toThrow(TypeError);
	});
});

// _logx
describe('_logx: (base: number, value: number) => number', () => {
	it('calculates logarithm with custom base correctly', () => {
		expect(_logx(2, 8)).toBeCloseTo(3);
		expect(_logx(10, 1000)).toBeCloseTo(3);
		expect(_logx(3, 27)).toBeCloseTo(3);
	});
	it('returns NaN for non-numeric base', () => {
		expect(_logx(NaN, 8)).toBeNaN();
		expect(_logx('a' as unknown as number, 8)).toBeNaN();
		expect(_logx(Infinity, 8)).toBeNaN();
	});
	it('returns NaN for non-numeric value', () => {
		expect(_logx(2, NaN)).toBeNaN();
		expect(_logx(2, 'a' as unknown as number)).toBeNaN();
		expect(_logx(2, Infinity)).toBeNaN();
	});
	it('handles edge cases correctly', () => {
		expect(_logx(2, 1)).toBe(0); // log base x of 1 is always 0
		expect(_logx(2, 2)).toBe(1); // log base x of x is always 1
		expect(_logx(1, 8)).toBe(Infinity); // log base 1 is Infinity
		expect(_logx(-1, 8)).toBeNaN(); // log base -1 is NaN
		expect(_logx(2, 0)).toBe(-Infinity); // log base 2 of 0 is -Infinity
		expect(_logx(-2, 8)).toBeNaN(); // log with negative base is NaN
		expect(_logx(2, -8)).toBeNaN(); // log of negative number is NaN
	});
});

// _numk
describe('_numk: (value: number, places: number = 1) => string', () => {
	it('formats numbers in thousands group correctly', () => {
		expect(_numk(1000)).toBe('1k');
		expect(_numk(1500)).toBe('1.5k');
		expect(_numk(1000000)).toBe('1M');
		expect(_numk(2500000000)).toBe('2.5B');
		expect(_numk(1000000000000)).toBe('1T');
	});
	it('formats negative numbers correctly', () => {
		expect(_numk(-1000)).toBe('-1k');
		expect(_numk(-1500000)).toBe('-1.5M');
	});
	it('returns NaN for non-numeric values', () => {
		expect(_numk(NaN)).toBe('NaN');
		expect(_numk('a' as unknown as number)).toBe('NaN');
	});
	it('handles different decimal places correctly', () => {
		expect(_numk(500.4535, 3)).toBe('500.454');
		expect(_numk(1500, 0)).toBe('2k');
		expect(_numk(1500, 1)).toBe('1.5k');
		expect(_numk(1535, 2)).toBe('1.54k');
		expect(_numk(1500, 3)).toBe('1.5k');
	});
	it('handles edge cases', () => {
		expect(_numk(0)).toBe('0');
		expect(_numk(1)).toBe('1');
		expect(_numk(-1)).toBe('-1');
		expect(_numk(999)).toBe('999');
		expect(_numk(2.453e15)).toBe('2.5e3T');
		expect(_numk(2.453e14)).toBe('245.3T');
		expect(_numk(2.453e12, 2)).toBe('2.45T');
	});
	it('defaults to 1 decimal place if invalid places are provided', () => {
		expect(_numk(1500, -1)).toBe('1.5k');
		expect(_numk(1500, 4)).toBe('1.5k'); // Assuming places are constrained to 0-3
		expect(_numk(1500, NaN)).toBe('1.5k');
	});
});

describe('\n _xcolumn: (column: number | string) => TXColumn', () => {
	it('Returns TXColumn from integer column argument 1 -> A', () => {
		const r: TXColumn = _xcolumn(1);
		expect(r).toBeDefined();
		expect(r.text).toBe('A');
		expect(r.value).toBe(1);
		expect(r.indexes).toEqual([0]);
	});

	it('Returns TXColumn from integer column argument 33 -> AG', () => {
		const r: TXColumn = _xcolumn(33);
		expect(r.text).toBe('AG');
		expect(r.value).toBe(33);
		expect(r.indexes).toEqual([0, 6]);
	});

	it('Returns TXColumn from string column "X"', () => {
		const r: TXColumn = _xcolumn('X');
		expect(r.text).toBe('X');
		expect(r.value).toBe(24);
		expect(r.indexes).toEqual([23]);
	});

	it('Returns TXColumn from string column "AA"', () => {
		const r: TXColumn = _xcolumn('AA');
		expect(r.text).toBe('AA');
		expect(r.value).toBe(27);
		expect(r.indexes).toEqual([0, 0]);
	});

	it('Supports numeric coercion via Number(result)', () => {
		const n = Number(_xcolumn('B'));
		expect(n).toBe(2);
		const n2 = Number(_xcolumn('ZZ'));
		expect(n2).toBe(702);
	});

	it('Supports string coercion via String(result)', () => {
		const s = String(_xcolumn(10));
		expect(s).toBe('J');
		const s2 = String(_xcolumn(702));
		expect(s2).toBe('ZZ');
	});

	it('Trims and uppercases string input', () => {
		const r: TXColumn = _xcolumn('  ab ');
		expect(r.text).toBe('AB');
		expect(r.value).toBe(28);
		expect(r.indexes).toEqual([0, 1]);
	});

	it('Throws on invalid numeric inputs (0, negative, NaN, Infinity)', () => {
		expect(() => _xcolumn(0)).toThrow(RangeError);
		expect(() => _xcolumn(-5)).toThrow(RangeError);
		expect(() => _xcolumn(Number.NaN)).toThrow(RangeError);
		expect(() => _xcolumn(Number.POSITIVE_INFINITY)).toThrow(RangeError);
	});

	it('Throws on invalid string inputs', () => {
		expect(() => _xcolumn('')).toThrow(RangeError);
		expect(() => _xcolumn('A1')).toThrow(RangeError);
		expect(() => _xcolumn('!@#')).toThrow(RangeError);
	});

	it('Handles large columns correctly (example: 16384 -> XFD)', () => {
		const r: TXColumn = _xcolumn(16384);
		expect(r.text).toBe('XFD');
		expect(r.value).toBe(16384);
		expect(r.indexes).toEqual([23, 5, 3]);
	});
});
