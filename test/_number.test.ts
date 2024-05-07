import {
	_deg2rad,
	_rad2deg,
	_distance,
	_round,
} from '../lib';
import { _expectTests } from './__helpers';

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

//_distance
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