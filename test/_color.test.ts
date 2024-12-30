import { ColorNames } from '../lib';

// Test lib/Color/_ColorNames.ts
describe('ColorNames', () => {
	it('should return the color value for the color name', () => {
		expect(ColorNames.aliceblue).toStrictEqual([240,248,255]);
		expect(ColorNames.brown).toStrictEqual([165,42,42]);
		expect(ColorNames.red).toStrictEqual([255,0,0]);
	});
});