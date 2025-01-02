import { ColorNames, Color } from '../lib';

// Test lib/Color/_ColorNames.ts
describe('\n ColorNames', () => {
	it('should return the color value for the color name', () => {
		expect(ColorNames.aliceblue).toStrictEqual([240,248,255]);
		expect(ColorNames.brown).toStrictEqual([165,42,42]);
		expect(ColorNames.red).toStrictEqual([255,0,0]);
	});
});

export function testPropertiesMatch<T>(
	instance: T,
	obj: Partial<Record<keyof T, any>>
): boolean {
	return Object.entries(obj).every(
		([key, value]) => (instance as any)[key] === value
	);
}

// Test lib/Color/_Color.ts
describe('\n Color', () => {

	// suppress console.error
	let orig_console_error: typeof console.error;
	beforeEach(() => {
		orig_console_error = console.error;
		console.error = jest.fn();
	});
	afterEach(() => {
		console.error = orig_console_error;
	});

	// Color.from.*
	it('Should set the correct `Color.value` property via `Color.from.*` parse methods.', () => {
		expect(Color.from.rgb('#fef')!.value).toStrictEqual([255, 238, 255, 1]);
		expect(Color.from.rgb('#fffFEF')!.value).toStrictEqual([255, 255, 239, 1]);
		expect(Color.from.value('#fffFEF')!.value).toStrictEqual([255, 255, 239, 1]);
		expect(Color.from.rgb('rgb(244, 233, 100)')!.value).toStrictEqual([244, 233, 100, 1]);
		expect(Color.from.rgb('rgb(244 233 100)')!.value).toStrictEqual([244, 233, 100, 1]);
		expect(Color.from.rgb('rgb(100%, 30%, 90%)')!.value).toStrictEqual([255, 77, 229, 1]);
		expect(Color.from.rgb('rgb(100% 30% 90%)')!.value).toStrictEqual([255, 77, 229, 1]);
		expect(Color.from.rgb('transparent')!.value).toStrictEqual([0, 0, 0, 0]);
		expect(Color.from.value('transparent')!.value).toStrictEqual([0, 0, 0, 0]);
		expect(Color.from.hsl('hsl(240, 100%, 50.5%)')!.value).toStrictEqual([240, 100, 50.5, 1]);
		expect(Color.from.hsl('hsl(240 100% 50.5%)')!.value).toStrictEqual([240, 100, 50.5, 1]);
		expect(Color.from.hsl('hsl(240deg, 100%, 50.5%)')!.value).toStrictEqual([240, 100, 50.5, 1]);
		expect(Color.from.hsl('hsl(240deg 100% 50.5%)')!.value).toStrictEqual([240, 100, 50.5, 1]);
		expect(Color.from.hwb('hwb(240, 100%, 50.5%)')!.value).toStrictEqual([240, 100, 50.5, 1]);
		expect(Color.from.hwb('hwb(240deg, 100%, 50.5%)')!.value).toStrictEqual([240, 100, 50.5, 1]);
	});

	// Color.parse
	it('Should return the correct `Color.parse` => `Color` instance `{value,format}` property values.', () => {
		expect(testPropertiesMatch(new Color('#fef', 'rgb'), {format: 'rgb', value: [255, 238, 255, 1]}));
		expect(testPropertiesMatch(Color.parse('#fef', 'rgb'), {format: 'rgb', value: [255, 238, 255, 1]}));
		expect(testPropertiesMatch(Color.parse('#fffFEF'), {format: 'rgb', value: [255, 255, 239, 1]}));
		expect(testPropertiesMatch(Color.parse('#fffFEFff'), {format: 'rgb', value: [255, 255, 239, 1]}));
		expect(testPropertiesMatch(Color.parse('#fffFEF00'), {format: 'rgb', value: [255, 255, 239, 0]}));
		expect(testPropertiesMatch(Color.parse('#fffFEFa9'), {format: 'rgb', value: [255, 255, 239, '0.66']}));
		expect(testPropertiesMatch(Color.parse('rgb(244, 233, 100)'), {format: 'rgb', value: [244, 233, 100, 1]}));
		expect(testPropertiesMatch(Color.parse('rgb(244 233 100)'), {format: 'rgb', value: [244, 233, 100, 1]}));
		expect(testPropertiesMatch(Color.parse('rgb(100%, 30%, 90%)'), {format: 'rgb', value: [255, 77, 229, 1]}));
		expect(testPropertiesMatch(Color.parse('rgb(100% 30% 90%)'), {format: 'rgb', value: [255, 77, 229, 1]}));
		expect(testPropertiesMatch(Color.parse('transparent'), {format: 'rgb', value: [0, 0, 0, 0]}));
		expect(testPropertiesMatch(Color.parse('hsl(240, 100%, 50.5%)'), {format: 'hsl', value: [240, 100, 50.5, 1]}));
		expect(testPropertiesMatch(Color.parse('hsl(-480, 100%, 50.5%)'), {format: 'hsl', value: [240, 100, 50.5, 1]}));
		expect(testPropertiesMatch(Color.parse('hsl(240 100% 50.5%)'), {format: 'hsl', value: [240, 100, 50.5, 1]}));
		expect(testPropertiesMatch(Color.parse('hsl(240deg, 100%, 50.5%)'), {format: 'hsl', value: [240, 100, 50.5, 1]}));
		expect(testPropertiesMatch(Color.parse('hsl(240deg 100% 50.5%)'), {format: 'hsl', value: [240, 100, 50.5, 1]}));
		expect(testPropertiesMatch(Color.parse('hwb(240, 100%, 50.5%)'), {format: 'hwb', value: [240, 100, 50.5, 1]}));
		expect(testPropertiesMatch(Color.parse('hwb(240deg, 100%, 50.5%)'), {format: 'hwb', value: [240, 100, 50.5, 1]}));
	});

	// Color.parse - invalid values
	it('Should return `null` when an invalid color string is passed to `Color.parse`.', () => {
		expect(Color.from.hsl('hsla(250, 100%, 50%, 50%)')).toBeNull();
		expect(Color.parse('hsla(250, 100%, 50%, 50%)')).toBeNull();
		expect(Color.parse('hsl(250 100% 50% / 50%)')).toBeNull();
		expect(Color.parse('rgba(250, 100%, 50%, 50%)')).toBeNull();
		expect(Color.parse('333333')).toBeNull();
		expect(Color.parse('#1')).toBeNull();
		expect(Color.parse('#f')).toBeNull();
		expect(Color.parse('#4f')).toBeNull();
		expect(Color.parse('#45ab4')).toBeNull();
		expect(Color.parse('#45ab45e')).toBeNull();
		expect(Color.parse('rgb()')).toBeNull();
		expect(Color.parse('rgb(10)')).toBeNull();
		expect(Color.parse('rgb(10,  2)')).toBeNull();
		expect(Color.parse('rgb(10,  2, 2348723dskjfs)')).toBeNull();
		expect(Color.parse('rgb(10%)')).toBeNull();
		expect(Color.parse('rgb(10%,  2%)')).toBeNull();
		expect(Color.parse('rgb(10%,  2%, 2348723%dskjfs)')).toBeNull();
		expect(Color.parse('rgb(10%,  2%, 2348723dskjfs%)')).toBeNull();
		expect(Color.parse('rgb(10$,3)')).toBeNull();
		expect(Color.parse('rgba(10,  3)')).toBeNull();
	});

	// new Color instance - invalid value
	it('Should `throw TypeError(\'Invalid color value\')` when creating `new Color` instance with invalid color value (async).', async () => {
		await expect(async () => new Color('hsla(250, 100%, 50%, 50%)')).rejects.toThrow('Invalid color value');
		await expect(async () => new Color('#4f')).rejects.toThrow(TypeError);
	});

	// with signed values
	it('Should return the correct `Color.value` property via `Color.from.*` parse methods with signed values.', () => {
		expect(Color.from.rgb('rgb(-244, +233, -100)')!.value).toStrictEqual([0, 233, 0, 1]);
		expect(Color.from.rgb('rgb(-244 +233 -100)')!.value).toStrictEqual([0, 233, 0, 1]);
		expect(Color.from.hsl('hsl(+240, 100%, 50.5%)')!.value).toStrictEqual([240, 100, 50.5, 1]);
		expect(Color.from.hsl('hsl(+240 100% 50.5%)')!.value).toStrictEqual([240, 100, 50.5, 1]);
		expect(Color.from.rgb('rgba(200, +20, -233, -0.0)')!.value).toStrictEqual([200, 20, 0, 0]);
		expect(Color.from.rgb('rgba(200 +20 -233 / -0.0)')!.value).toStrictEqual([200, 20, 0, 0]);
		expect(Color.from.rgb('rgba(200, +20, -233, -0.0)')!.value).toStrictEqual([200, 20, 0, 0]);
		expect(Color.from.rgb('rgba(200 +20 -233 / -0.0)')!.value).toStrictEqual([200, 20, 0, 0]);
		expect(Color.from.hsl('hsla(+200, 100%, 50%, -0.2)')!.value).toStrictEqual([200, 100, 50, 0]);
		expect(Color.from.hsl('hsla(+200, 100%, 50%, -1e-7)')!.value).toStrictEqual([200, 100, 50, 0]);
		expect(Color.from.hsl('hsl(+200 100% 50% / -0.2)')!.value).toStrictEqual([200, 100, 50, 0]);
		expect(Color.from.hsl('hsl(+200 100% 50% / -1e-7)')!.value).toStrictEqual([200, 100, 50, 0]);
		expect(Color.from.hsl('hsl(+200 100% 50% / -2.e7)')!.value).toStrictEqual([200, 100, 50, 0]);
		expect(Color.from.hsl('hsl(+200 100% 50% / +1e7)')!.value).toStrictEqual([200, 100, 50, 1]);
		expect(Color.from.hsl('hsl(+200 100% 50% / 127.88e4)')!.value).toStrictEqual([200, 100, 50, 1]);
		expect(Color.from.hsl('hsl(+200 100% 50% / 0.2e3)')!.value).toStrictEqual([200, 100, 50, 1]);
		expect(Color.from.hsl('hsl(+200 100% 50% / .1e-4)')!.value).toStrictEqual([200, 100, 50, 1e-5]);
		expect(Color.from.hsl('hsla(-10.0, 100%, 50%, -0.2)')!.value).toStrictEqual([350, 100, 50, 0]);
		expect(Color.from.hsl('hsl(-10.0 100% 50% / -0.2)')!.value).toStrictEqual([350, 100, 50, 0]);
		expect(Color.from.hsl('hsla(.5, 100%, 50%, -0.2)')!.value).toStrictEqual([0.5, 100, 50, 0]);
		expect(Color.from.hsl('hsl(.5 100% 50% / -0.2)')!.value).toStrictEqual([0.5, 100, 50, 0]);
		expect(Color.from.hwb('hwb(+240, 100%, 50.5%)')!.value).toStrictEqual([240, 100, 50.5, 1]);
		expect(Color.from.hwb('hwb(-240deg, 100%, 50.5%)')!.value).toStrictEqual([120, 100, 50.5, 1]);
		expect(Color.from.hwb('hwb(-240deg, 100%, 50.5%, +0.6)')!.value).toStrictEqual([120, 100, 50.5, 0.6]);
		expect(Color.from.hwb('hwb(-240deg, 100%, 50.5%, +1e-7)')!.value).toStrictEqual([120, 100, 50.5, 1e-7]);
		expect(Color.from.hwb('hwb(-240deg, 100%, 50.5%, -2.e7)')!.value).toStrictEqual([120, 100, 50.5, 0]);
		expect(Color.from.hwb('hwb(-240deg, 100%, 50.5%, +1e7)')!.value).toStrictEqual([120, 100, 50.5, 1]);
		expect(Color.from.hwb('hwb(-240deg, 100%, 50.5%, +1e7)')!.value).toStrictEqual([120, 100, 50.5, 1]);
		expect(Color.from.hwb('hwb(-240deg, 100%, 50.5%, 127.88e4)')!.value).toStrictEqual([120, 100, 50.5, 1]);
		expect(Color.from.hwb('hwb(-240deg, 100%, 50.5%, 0.2e3)')!.value).toStrictEqual([120, 100, 50.5, 1]);
		expect(Color.from.hwb('hwb(-240deg, 100%, 50.5%, .1e-4)')!.value).toStrictEqual([120, 100, 50.5, 1e-5]);
		expect(Color.from.hwb('hwb(10.0deg, 100%, 50.5%)')!.value).toStrictEqual([10, 100, 50.5, 1]);
		expect(Color.from.hwb('hwb(-.5, 100%, 50.5%)')!.value).toStrictEqual([359.5, 100, 50.5, 1]);
		expect(Color.from.hwb('hwb(-10.0deg, 100%, 50.5%, +0.6)')!.value).toStrictEqual([350, 100, 50.5, 0.6]);
	});

	// subsequent return values should not change array
	it('Should return the correct `Color.value` property via `Color.from.*` parse methods with subsequent return values.', () => {
		expect(Color.from.rgb('blue')!.value).toStrictEqual([0, 0, 255, 1]);
		expect(Color.from.rgb('blue')!.value).toStrictEqual([0, 0, 255, 1]);
	});
	
	// alpha
	it('Should return the correct `Color.value` property via `Color.from.*` parse methods with alpha values.', () => {
		expect(Color.from.value([255, 255, 255, 0.6666666666])!.normalizeAlpha().value).toStrictEqual([255, 255, 255, 0.67]);
		expect(Color.from.rgb('#fffa')!.normalizeAlpha().value).toStrictEqual([255, 255, 255, 0.67]);
		expect(Color.from.rgb('#c814e933')!.value).toStrictEqual([200, 20, 233, 0.2]);
		expect(Color.from.rgb('#c814e900')!.value).toStrictEqual([200, 20, 233, 0]);
		expect(Color.from.rgb('#c814e9ff')!.value).toStrictEqual([200, 20, 233, 1]);
		expect(Color.from.rgb('rgba(200, 20, 233, 0.2)')!.value).toStrictEqual([200, 20, 233, 0.2]);
		expect(Color.from.rgb('rgba(200 20 233 / 0.2)')!.value).toStrictEqual([200, 20, 233, 0.2]);
		expect(Color.from.rgb('rgba(200 20 233 / 20%)')!.value).toStrictEqual([200, 20, 233, 0.2]);
		expect(Color.from.rgb('rgba(200, 20, 233, 0)')!.value).toStrictEqual([200, 20, 233, 0]);
		expect(Color.from.rgb('rgba(200 20 233 / 0)')!.value).toStrictEqual([200, 20, 233, 0]);
		expect(Color.from.rgb('rgba(200 20 233 / 0%)')!.value).toStrictEqual([200, 20, 233, 0]);
		expect(Color.from.rgb('rgba(100%, 30%, 90%, 0.2)')!.value).toStrictEqual([255, 77, 229, 0.2]);
		expect(Color.from.rgb('rgba(100% 30% 90% / 0.2)')!.value).toStrictEqual([255, 77, 229, 0.2]);
		expect(Color.from.rgb('rgba(100% 30% 90% / 20%)')!.value).toStrictEqual([255, 77, 229, 0.2]);
		expect(Color.from.hsl('hsla(200, 20%, 33%, 0.2)')!.value).toStrictEqual([200, 20, 33, 0.2]);
		expect(Color.from.hsl('hsla(200, 20%, 33%, 1e-7)')!.value).toStrictEqual([200, 20, 33, 1e-7]);
		expect(Color.from.hsl('hsl(200 20% 33% / 0.2)')!.value).toStrictEqual([200, 20, 33, 0.2]);
		expect(Color.from.hsl('hsl(200 20% 33% / 1e-7)')!.value).toStrictEqual([200, 20, 33, 1e-7]);
		expect(Color.from.hwb('hwb(200, 20%, 33%, 0.2)')!.value).toStrictEqual([200, 20, 33, 0.2]);
		expect(Color.from.hwb('hwb(200, 20%, 33%, 1e-7)')!.value).toStrictEqual([200, 20, 33, 1e-7]);
	});
	
	// no alpha
	it('Should return the correct `Color.value` property via `Color.from.*` parse methods without alpha values.', () => {
		expect(Color.from.rgb('#fef')!.value).toStrictEqual([255, 238, 255, 1]);
		expect(Color.from.rgb('rgba(200, 20, 233)')!.value).toStrictEqual([200, 20, 233, 1]);
		expect(Color.from.rgb('rgba(200 20 233)')!.value).toStrictEqual([200, 20, 233, 1]);
		expect(Color.from.hsl('hsl(240, 100%, 50.5%)')!.value).toStrictEqual([240, 100, 50.5, 1]);
		expect(Color.from.hsl('hsl(240 100% 50.5%)')!.value).toStrictEqual([240, 100, 50.5, 1]);
		expect(Color.from.rgb('rgba(0, 0, 0, 0)')!.value).toStrictEqual([0, 0, 0, 0]);
		expect(Color.from.rgb('rgba(0 0 0 / 0)')!.value).toStrictEqual([0, 0, 0, 0]);
		expect(Color.from.hsl('hsla(0, 0%, 0%, 0)')!.value).toStrictEqual([0, 0, 0, 0]);
		expect(Color.from.hsl('hsl(0 0% 0% / 0)')!.value).toStrictEqual([0, 0, 0, 0]);
		expect(Color.from.hsl('hsl(0deg 0% 0% / 0)')!.value).toStrictEqual([0, 0, 0, 0]);
		expect(Color.from.hwb('hwb(400, 10%, 200%, 0)')!.value).toStrictEqual([40, 10, 100, 0]);
	});
	
	// range
	it('Should return the correct `Color.value` property via `Color.from.*` parse methods with range values.', () => {
		expect(Color.from.rgb('rgba(300, 600, 100, 3)')!.value).toStrictEqual([255, 255, 100, 1]);
		expect(Color.from.rgb('rgba(300 600 100 / 3)')!.value).toStrictEqual([255, 255, 100, 1]);
		expect(Color.from.rgb('rgba(8000%, 100%, 333%, 88)')!.value).toStrictEqual([255, 255, 255, 1]);
		expect(Color.from.rgb('rgba(8000% 100% 333% / 88)')!.value).toStrictEqual([255, 255, 255, 1]);
		expect(Color.from.hsl('hsla(400, 10%, 200%, 10)')!.value).toStrictEqual([40, 10, 100, 1]);
		expect(Color.from.hsl('hsl(400 10% 200% / 10)')!.value).toStrictEqual([40, 10, 100, 1]);
		expect(Color.from.hwb('hwb(400, 10%, 200%, 10)')!.value).toStrictEqual([40, 10, 100, 1]);
	});
	
	// invalid
	it('Should return `null` when an invalid color string is passed to `Color.from.*` parse methods.', () => {
		expect(Color.from.rgb('yellowblue')).toBeNull();
		expect(Color.from.rgb('hsl(100, 10%, 10%)')).toBeNull();
		expect(Color.from.rgb('hsl(100 10% 10%)')).toBeNull();
		expect(Color.from.rgb('hwb(100, 10%, 10%)')).toBeNull();
		expect(Color.from.rgb('rgb(123, 255, 9)1234')).toBeNull();
		expect(Color.from.rgb('rgb(123 255 9)1234')).toBeNull();
		expect(Color.from.rgb('333333')).toBeNull();
		expect(Color.from.rgb('1')).toBeNull();
		expect(Color.from.rgb('1892371923879')).toBeNull();
		expect(Color.from.rgb('444')).toBeNull();
		expect(Color.from.rgb('#1')).toBeNull();
		expect(Color.from.rgb('#f')).toBeNull();
		expect(Color.from.rgb('#4f')).toBeNull();
		expect(Color.from.rgb('#45ab4')).toBeNull();
		expect(Color.from.rgb('#45ab45e')).toBeNull();
		expect(Color.from.hsl('hsl(41, 50%, 45%)1234')).toBeNull();
		expect(Color.from.hsl('hsl(41 50% 45%)1234')).toBeNull();
		expect(Color.from.hsl('hsl(41 50% 45% / 3)1234')).toBeNull();
		expect(Color.from.hsl('hsl(41 50% 45% / 1e)')).toBeNull();
		expect(Color.from.hsl('hsl(41 50% 45% / e)')).toBeNull();
		expect(Color.from.hsl('hsl(41 50% 45% / 0e-)')).toBeNull();
		expect(Color.from.hsl('hsl(41 50% 45% / 0e+)')).toBeNull();
		expect(Color.from.hsl('hsl(41 50% 45% / +000e33)')).toBeNull();
		expect(Color.from.hwb('hwb(240, 100%, 1e')).toBeNull();
		expect(Color.from.hwb('hwb(240, 100%, e')).toBeNull();
		expect(Color.from.hwb('hwb(240, 100%, 0e-')).toBeNull();
		expect(Color.from.hwb('hwb(240, 100%, 0e+')).toBeNull();
		expect(Color.from.hwb('hwb(240, 100%, +000e33')).toBeNull();
	});
	
	// generators
	it('Should return the correct `Color.to.*` conversion `string` result `Color.from.*` parse methods with generators.', () => {
		expect(Color.to.hex([255, 10, 35])).toStrictEqual('#FF0A23');
		expect(Color.to.hex([255, 10, 35, 1])).toStrictEqual('#FF0A23');
		expect(Color.to.hex([255, 10, 35], 1)).toStrictEqual('#FF0A23');
		expect(Color.to.hex([255, 10, 35, 0.3])).toStrictEqual('#FF0A234D');
		expect(Color.to.hex([255, 10, 35], 0.3)).toStrictEqual('#FF0A234D');
		expect(Color.to.hex([255, 10, 35, 0])).toStrictEqual('#FF0A2300');
		expect(Color.to.hex([255, 10, 35], 0)).toStrictEqual('#FF0A2300');
		
		expect(Color.to.rgb([255, 10, 35])).toStrictEqual('rgb(255, 10, 35)');
		expect(Color.to.rgb([255, 10, 35, 0.3])).toStrictEqual('rgba(255, 10, 35, 0.3)');
		expect(Color.to.rgb([255, 10, 35], 0.3)).toStrictEqual('rgba(255, 10, 35, 0.3)');
		expect(Color.to.rgb([255, 10, 35, 0.3])).toStrictEqual('rgba(255, 10, 35, 0.3)');
		expect(Color.to.rgb([255, 10, 35], 0.3)).toStrictEqual('rgba(255, 10, 35, 0.3)');
		expect(Color.to.rgb([255, 10, 35])).toStrictEqual('rgb(255, 10, 35)');
		expect(Color.to.rgb([255, 10, 35, 0])).toStrictEqual('rgba(255, 10, 35, 0)');
		
		//--
		expect(Color.to.rgb_percent([255, 10, 35])).toStrictEqual('rgb(100%, 4%, 14%)');
		expect(Color.to.rgba_percent([255, 10, 35])).toStrictEqual('rgba(100%, 4%, 14%, 1)');
		
		expect(Color.to.rgb_percent([255, 10, 35, 0.3])).toStrictEqual('rgba(100%, 4%, 14%, 0.3)');
		expect(Color.to.rgb_percent([255, 10, 35], 0.3)).toStrictEqual('rgba(100%, 4%, 14%, 0.3)');
		expect(Color.to.rgb_percent([255, 10, 35, 0.3])).toStrictEqual('rgba(100%, 4%, 14%, 0.3)');
		expect(Color.to.rgb_percent([255, 10, 35], 0.3)).toStrictEqual('rgba(100%, 4%, 14%, 0.3)');
		expect(Color.to.rgb_percent([255, 10, 35])).toStrictEqual('rgb(100%, 4%, 14%)');
		
		expect(Color.to.hsl([280, 40, 60])).toStrictEqual('hsl(280, 40%, 60%)');
		expect(Color.to.hsl([280, 40, 60, 0.3])).toStrictEqual('hsla(280, 40%, 60%, 0.3)');
		expect(Color.to.hsl([280, 40, 60], 0.3)).toStrictEqual('hsla(280, 40%, 60%, 0.3)');
		expect(Color.to.hsl([280, 40, 60, 0.3])).toStrictEqual('hsla(280, 40%, 60%, 0.3)');
		expect(Color.to.hsl([280, 40, 60], 0.3)).toStrictEqual('hsla(280, 40%, 60%, 0.3)');
		expect(Color.to.hsl([280, 40, 60], 0)).toStrictEqual('hsla(280, 40%, 60%, 0)');
		expect(Color.to.hsl([280, 40, 60])).toStrictEqual('hsl(280, 40%, 60%)');
		
		expect(Color.to.hwb([280, 40, 60])).toStrictEqual('hwb(280, 40%, 60%)');
		expect(Color.to.hwb([280, 40, 60, 0.3])).toStrictEqual('hwb(280, 40%, 60%, 0.3)');
		expect(Color.to.hwb([280, 40, 60], 0.3)).toStrictEqual('hwb(280, 40%, 60%, 0.3)');
		expect(Color.to.hwb([280, 40, 60], 0)).toStrictEqual('hwb(280, 40%, 60%, 0)');
		
		expect(Color.to.keyword([255, 255, 0])).toStrictEqual('yellow');
		expect(Color.to.keyword(['constructor'])).toBe('');
		expect(Color.from.value(['constructor'])?.to.keyword()).toBeUndefined();
		expect(Color.to.keyword([100, 255, 0])).toBe('');
	});

	// toString
	it('Should return the correct `Color.toString` conversion `string` result `Color.from.*` parse methods.', () => {
		expect(String(Color.from.value([44.2, 83.8, 44]))).toStrictEqual('rgb(44, 84, 44)');
		expect(Color.from.value([44.2, 83.8, 44])!.to.rgb()).toStrictEqual('rgb(44, 84, 44)');
		expect(Color.from.value([44.2, 83.8, 44])!.to.rgba()).toStrictEqual('rgba(44, 84, 44, 1)');
	});

	// Make sure writing decimal values as hex doesn't cause bizarre output (regression test, #25)
	it('\n Should return the correct `Color.to.hex` conversion `string` result `Color.from.*` parse methods.', () => {
		expect(Color.from.value([44.2, 83.8, 44])!.to.hex()).toStrictEqual('#2C542C');
		expect(Color.from.value([44.2, 83.8, 44])!.to.hexl()).toStrictEqual('#2c542c');
	});
});