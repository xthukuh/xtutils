/**
 * Color Utils - [ported from color-string](https://github.com/Qix-/color-string)
 */

import { _clamp, _parse_float, _parse_int, _str, _flatten } from '../utils';
import { ColorNames } from './_ColorNames';

/**
 * Mapped `ColorNames` - `[value => name]`
 */
const ColorValueName = Object.fromEntries(Object.entries(ColorNames).map(([key, value]) => [value, key]));

/**
 * Color value type
 */
export type TColorValue = [number,number,number,number];

/**
 * Convert a number to a hex string
 * 
 * @param num - number to convert
 * @returns `string`
 */
const hex_double = (num: number): string => Math.round(num).toString(16).toUpperCase().padStart(2, '0');

/**
 * Get color array value arguments
 * 
 * @param args - parse arguments
 * @returns `TColorValue` or `null`
 */
const parse_args = (args: any[], max?: number): TColorValue|null => {
	const has_max: boolean = Number.isInteger(max) && Number(max) >= 255;
	const items: any[] = (Array.isArray(args) ? _flatten(args) : []).map(v => _parse_float(v, NaN));
	if (items.length < 3) return null;
	if (items.filter(v => isNaN(v)).length) return null;
	const res: TColorValue = items.slice(0, 4).map((val, i) => {
		if (!has_max) return val;
		if (i < 3) return max === 360 && i ? _clamp(val, 0, 100) : _clamp(val, 0, max);
		return _clamp(val, 0, 1);
	}) as any;
	if (res.length < 4) res[3] = 1;
	return res;
};

/**
 * Parse color `string` to RGB array values
 * 
 * @param str - parse string
 * @returns `[R,G,B,A]` or `null`
 */
const get_rgb = (str: string): TColorValue|null => {
	if (!(str = _str(str, true))) return null;
	const abbr = /^#([a-f0-9]{3,4})$/i;
	const hex = /^#([a-f0-9]{6})([a-f0-9]{2})?$/i;
	const rgba = /^rgba?\(\s*([+-]?\d+)(?=[\s,])\s*(?:,\s*)?([+-]?\d+)(?=[\s,])\s*(?:,\s*)?([+-]?\d+)\s*(?:[,|\/]\s*([+-]?[\d\.]+)(%?)\s*)?\)$/i;
	const per = /^rgba?\(\s*([+-]?[\d\.]+)\%\s*,?\s*([+-]?[\d\.]+)\%\s*,?\s*([+-]?[\d\.]+)\%\s*(?:[,|\/]\s*([+-]?[\d\.]+)(%?)\s*)?\)$/i;
	const keyword = /^(\w+)$/;
	let rgb: TColorValue = [0, 0, 0, 1];
	let match: RegExpMatchArray|null|string;
	let hexAlpha: string;
	if (match = str.match(hex)) {
		hexAlpha = match[2];
		match = match[1];
		if (match.length === 3){
			match = match.split('').map((char: string) => char + char).join('');
		}
		for (let i = 0; i < 3; i ++) {
			// https://jsperf.com/slice-vs-substr-vs-substring-methods-long-string/19
			const i2 = i * 2;
			rgb[i] = _parse_int(match.slice(i2, i2 + 2), 16);
		}
		if (hexAlpha) rgb[3] = _parse_int(hexAlpha, 16) / 255;
	}
	else if (match = str.match(abbr)) {
		match = match[1];
		hexAlpha = match[3];
		for (let i = 0; i < 3; i ++) rgb[i] = _parse_int(match[i] + match[i], 16);
		if (hexAlpha)  rgb[3] = _parse_int(hexAlpha + hexAlpha, 16) / 255;
	}
	else if (match = str.match(rgba)) {
		for (let i = 0; i < 3; i ++) rgb[i] = _parse_int(match[i + 1], 0);
		if (match[4]) {
			if (match[5]) rgb[3] = _parse_float(match[4]) * 0.01;
			else rgb[3] = _parse_float(match[4]);
		}
	}
	else if (match = str.match(per)) {
		for (let i = 0; i < 3; i ++) rgb[i] = Math.round(_parse_float(match[i + 1]) * 2.55);
		if (match[4]) {
			if (match[5]) rgb[3] = _parse_float(match[4]) * 0.01;
			else rgb[3] = _parse_float(match[4]);
		}
	}
	else if (match = str.match(keyword)) {
		const m = match[1].toLowerCase();
		if (m === 'transparent') return [0, 0, 0, 0];
		if (!Object.hasOwnProperty.call(ColorNames, m)) return null;
		rgb = (ColorNames as any)[m];
		rgb[3] = 1;
		return rgb;
	}
	else return null;
	for (let i = 0; i < 3; i ++) {
		rgb[i] = _clamp(rgb[i], 0, 255);
	}
	rgb[3] = _clamp(rgb[3], 0, 1);
	return rgb;
};

/**
 * Parse color `string` to HSL array values
 * 
 * @param str - parse string
 * @returns `[H,S,L,A]` or `null`
 */
const get_hsl = (str: string): TColorValue|null => {
	if (!(str = _str(str, true))) return null;
	const hsl = /^hsla?\(\s*([+-]?(?:\d{0,3}\.)?\d+)(?:deg)?\s*,?\s*([+-]?[\d\.]+)%\s*,?\s*([+-]?[\d\.]+)%\s*(?:[,|\/]\s*([+-]?(?=\.\d|\d)(?:0|[1-9]\d*)?(?:\.\d*)?(?:[eE][+-]?\d+)?)\s*)?\)$/i;
	const match: RegExpMatchArray|null = str.match(hsl);
	if (!match) return null;
	const alpha = _parse_float(match[4], NaN);
	const h = ((_parse_float(match[1]) % 360) + 360) % 360;
	const s = _clamp(_parse_float(match[2]), 0, 100);
	const l = _clamp(_parse_float(match[3]), 0, 100);
	const a = _clamp(isNaN(alpha) ? 1 : alpha, 0, 1);
	return [h, s, l, a];
};

/**
 * Parse color `string` to HWB array values
 * 
 * @param str - parse string
 * @returns `[H,W,B,A]` or `null`
 */
const get_hwb = (str: string): TColorValue|null => {
	if (!(str = _str(str, true))) return null;
	const hwb = /^hwb\(\s*([+-]?\d{0,3}(?:\.\d+)?)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?(?=\.\d|\d)(?:0|[1-9]\d*)?(?:\.\d*)?(?:[eE][+-]?\d+)?)\s*)?\)$/i;
	const match: RegExpMatchArray|null = str.match(hwb);
	if (!match) return null;
	const alpha = _parse_float(match[4], NaN);
	const h = ((_parse_float(match[1]) % 360) + 360) % 360;
	const w = _clamp(_parse_float(match[2]), 0, 100);
	const b = _clamp(_parse_float(match[3]), 0, 100);
	const a = _clamp(isNaN(alpha) ? 1 : alpha, 0, 1);
	return [h, w, b, a];
};

/**
 * Color model type
 */
type TColorFormat = 'rgb'|'hsl'|'hwb';

/**
 * Color model interface
 */
interface IColorModel {
	format: TColorFormat;
	value: TColorValue;
}

/**
 * Parse color `string` to color model
 * 
 * @param str - parse string
 * @returns `IColorModel` or `null`
 */
const color_get = (str: string): IColorModel|null => {
	if (!(str = _str(str, true))) return null;
	const prefix: string = str.slice(0, 3).toLowerCase();
	let value: TColorValue|null;
	let format: TColorFormat;
	switch (prefix) {
		case 'hsl':
			value = get_hsl(str);
			format = 'hsl';
			break;
		case 'hwb':
			value = get_hwb(str);
			format = 'hwb';
			break;
		default:
			value = get_rgb(str);
			format = 'rgb';
			break;
	}
	return value ? {format, value} : null;
};

/**
 * Get HEX color `string` from array value
 * 
 * @param args - color array value
 * @returns `string` or `''`
 */
const to_hex = (...args: any[]): string => {
	const rgba = parse_args(args, 255);
	if (!rgba) return '';
	return '#' + rgba.slice(0, 3).map((val: any) => hex_double(val)).join('')
	+ (rgba[3] < 1 ? hex_double(Math.round(rgba[3] * 255)) : '');
};

/**
 * Get RGB color `string` from array value
 * 
 * @param args - color array value
 * @returns `string` or `''`
 */
const to_rgb = (...args: any[]): string => {
	const rgba = parse_args(args, 255);
	if (!rgba) return '';
	return rgba[3] === 1
	? 'rgb(' + Math.round(rgba[0]) + ', ' + Math.round(rgba[1]) + ', ' + Math.round(rgba[2]) + ')'
	: 'rgba(' + Math.round(rgba[0]) + ', ' + Math.round(rgba[1]) + ', ' + Math.round(rgba[2]) + ', ' + rgba[3] + ')';
};

/**
 * Get RGBA color `string` from array value
 * 
 * @param args - color array value
 * @returns `string` or `''`
 */
const to_rgba = (...args: any[]): string => {
	const rgba = parse_args(args, 255);
	if (!rgba) return '';
	return 'rgba(' + Math.round(rgba[0]) + ', ' + Math.round(rgba[1]) + ', ' + Math.round(rgba[2]) + ', ' + rgba[3] + ')';
};

/**
 * Get RGB percent color `string` from array value
 * 
 * @param args - color array value
 * @returns `string` or `''`
 */
const to_rgb_percent = (...args: any[]): string => {
	const rgba = parse_args(args, 255);
	if (!rgba) return '';
	const r = Math.round(rgba[0] / 255 * 100);
	const g = Math.round(rgba[1] / 255 * 100);
	const b = Math.round(rgba[2] / 255 * 100);
	return rgba[3] === 1
	? 'rgb(' + r + '%, ' + g + '%, ' + b + '%)'
	: 'rgba(' + r + '%, ' + g + '%, ' + b + '%, ' + rgba[3] + ')';
};

/**
 * Get RGBA percent color `string` from array value
 * 
 * @param args - color array value
 * @returns `string` or `''`
 */
const to_rgba_percent = (...args: any[]): string => {
	const rgba = parse_args(args, 255);
	if (!rgba) return '';
	const r = Math.round(rgba[0] / 255 * 100);
	const g = Math.round(rgba[1] / 255 * 100);
	const b = Math.round(rgba[2] / 255 * 100);
	return 'rgba(' + r + '%, ' + g + '%, ' + b + '%, ' + rgba[3] + ')';
};

/**
 * Get HSL color `string` from array value
 * 
 * @param args - color array value
 * @returns `string` or `''`
 */
const to_hsl = (...args: any[]): string => {
	const hsla = parse_args(args, 360);
	if (!hsla) return '';
	return hsla[3] === 1
	? 'hsl(' + hsla[0] + ', ' + hsla[1] + '%, ' + hsla[2] + '%)'
	: 'hsla(' + hsla[0] + ', ' + hsla[1] + '%, ' + hsla[2] + '%, ' + hsla[3] + ')';
};

/**
 * Get HSL color `string` from array value
 * 
 * @param args - color array value
 * @returns `string` or `''`
 */
const to_hsla = (...args: any[]): string => {
	const hsla = parse_args(args, 360);
	if (!hsla) return '';
	return 'hsla(' + hsla[0] + ', ' + hsla[1] + '%, ' + hsla[2] + '%, ' + hsla[3] + ')';
};

/**
 * Get HWB color `string` from array value
 * 
 * @param args - color array value
 * @returns `string` or `''`
 */
const to_hwb = (...args: any[]): string => {
	const hwba = parse_args(args, 360);
	if (!hwba) return '';
	const a = hwba[3] !== 1 ? ', ' + hwba[3] : '';
	return 'hwb(' + hwba[0] + ', ' + hwba[1] + '%, ' + hwba[2] + '%' + a + ')';
};

/**
 * Get HWBA color `string` from array value
 * 
 * @param args - color array value
 * @returns `string` or `''`
 */
const to_hwba = (...args: any[]): string => {
	const hwba = parse_args(args, 360);
	if (!hwba) return '';
	return 'hwb(' + hwba[0] + ', ' + hwba[1] + '%, ' + hwba[2] + '%, ' + hwba[3] + ')';
};

/**
 * Get color name `string` from array value
 * 
 * @param args - color array value
 * @returns `string` or `''`
 */
const to_keyword = (...args: any[]): string => {
	const rgba = parse_args(args, 255);
	if (!rgba) return '';
	const key: any = rgba.slice(0, 3);
	return key in ColorValueName ? ColorValueName[key] : '';
};


/**
 * Color to converter interface
 */
export interface IColorTo {
	hex: () => string;
	hexl: () => string;
	rgb: () => string;
	rgba: () => string;
	rgb_percent: () => string;
	rgba_percent: () => string;
	hsl: () => string;
	hsla: () => string;
	hwb: () => string;
	hwba: () => string;
	keyword: () => string;
}

/**
 * Static color to converter interface
 */
export interface IStaticColorTo {
	hex: (...args: any[]) => string;
	hexl: (...args: any[]) => string;
	rgb: (...args: any[]) => string;
	rgba: (...args: any[]) => string;
	rgb_percent: (...args: any[]) => string;
	rgba_percent: (...args: any[]) => string;
	hsl: (...args: any[]) => string;
	hsla: (...args: any[]) => string;
	hwb: (...args: any[]) => string;
	hwba: (...args: any[]) => string;
	keyword: (...args: any[]) => string;
}

/**
 * Color class interface
 */
export interface IColor {
	value: TColorValue;
	format: TColorFormat;
	to: IColorTo;
	normalizeAlpha: () => IColor;
	toString: () => string;
}

/**
 * Color parse from interface
 */
export interface IStaticColorFrom {
	rgb: (str: string) => IColor|null;
	hsl: (str: string) => IColor|null;
	hwb: (str: string) => IColor|null;
	value: (...args: any[]) => IColor|null;
}

/**
 * `Color` props symbol
 */
const _props = Symbol('Color.props');

/**
 * @class Color parser and converter
 */
export class Color implements IColor
{
	/**
	 * Color parser props
	 */
	[_props]: {
		value: TColorValue;
		format: TColorFormat;
	} = {} as any;

	/**
	 * Parsed color array value
	 */
	get value(): TColorValue
	{
		return this[_props].value;
	}

	/**
	 * Parsed color format
	 */
	get format(): TColorFormat
	{
		return this[_props].format;
	}

	/**
	 * Create new color parser instance
	 * 
	 * @param value - parse value 
	 * @param format - parse format
	 * @returns `IColor` ~ `Color` instance
	 * @throws `TypeError`
	 */
	constructor(value: any, format: TColorFormat = 'rgb') {
		if ('string' === typeof value) {
			const color = color_get(value);
			if (!color) throw new TypeError('Invalid color value');
			this[_props].value = color.value;
			this[_props].format = color.format;
			return;
		}
		if (!(Array.isArray(value) && value.length === 4 && value.every(v => typeof v === 'number'))) throw new TypeError('Invalid color value');
		this[_props].value = value as TColorValue;
		this[_props].format = format;
	}

	/**
	 * Normalize alpha value
	 */
	normalizeAlpha(): IColor
	{
		if (Array.isArray(this.value) && this.value.length === 4 && this.value[3].toString().indexOf('.') > 0) {
			this[_props].value[3] = Number(this.value[3].toFixed(2));
		}
		return this;
	}

	/**
	 * Convert color to `string` (RGB)
	 */
	toString(): string
	{
		console.log('Color.toString:', {value: this.value, format: this.format});
		return this.to.rgb();
		// return this.normalizeAlpha().to.rgb();
	}

	/**
	 * Color to converter
	 */
	get to(): IColorTo
	{
		const that = this;
		return {
			hex: function(): string
			{
				return to_hex(...that.value);
			},
			hexl: function(): string
			{
				return to_hex(...that.value).toLowerCase();
			},
			rgb: function(): string
			{
				return to_rgb(...that.value);
			},
			rgba: function(): string
			{
				return to_rgba(...that.value);
			},
			rgb_percent: function(): string
			{
				return to_rgb_percent(...that.value);
			},
			rgba_percent: function(): string
			{
				return to_rgba_percent(...that.value);
			},
			hsl: function(): string
			{
				return to_hsl(...that.value);
			},
			hsla: function(): string
			{
				return to_hsla(...that.value);
			},
			hwb: function(): string
			{
				return to_hwb(...that.value);
			},
			hwba: function(): string
			{
				return to_hwba(...that.value);
			},
			keyword: function(): string
			{
				return to_keyword(...that.value);
			},
		};
	}

	/**
	 * Static color value to converter
	 */
	static get to(): IStaticColorTo
	{
		const that = this;
		return {
			hex: function(...args: any[]): string
			{
				const col: IColor|null = that.from.value(...args);
				return col ? col.to.hex() : '';
			},
			hexl: function(...args: any[]): string
			{
				const col: IColor|null = that.from.value(...args);
				return col ? col.to.hex().toLowerCase() : '';
			},
			rgb: function(...args: any[]): string
			{
				const col: IColor|null = that.from.value(...args);
				return col ? col.to.rgb() : '';
			},
			rgba: function(...args: any[]): string
			{
				const col: IColor|null = that.from.value(...args);
				return col ? col.to.rgba() : '';
			},
			rgb_percent: function(...args: any[]): string
			{
				const col: IColor|null = that.from.value(...args);
				return col ? col.to.rgb_percent() : '';
			},
			rgba_percent: function(...args: any[]): string
			{
				const col: IColor|null = that.from.value(...args);
				return col ? col.to.rgba_percent() : '';
			},
			hsl: function(...args: any[]): string
			{
				const col: IColor|null = that.from.value(...args);
				return col ? col.to.hsl() : '';
			},
			hsla: function(...args: any[]): string
			{
				const col: IColor|null = that.from.value(...args);
				return col ? col.to.hsla() : '';
			},
			hwb: function(...args: any[]): string
			{
				const col: IColor|null = that.from.value(...args);
				return col ? col.to.hwb() : '';
			},
			hwba: function(...args: any[]): string
			{
				const col: IColor|null = that.from.value(...args);
				return col ? col.to.hwba() : '';
			},
			keyword: function(...args: any[]): string
			{
				const col: IColor|null = that.from.value(...args);
				return col ? col.to.keyword() : '';
			},
		};
	}

	/**
	 * Parse color value from
	 */
	static get from(): IStaticColorFrom
	{
		return {
			rgb: function(str: string): IColor|null
			{
				const val: TColorValue|null = get_rgb(str);
				return val ? new Color(val, 'rgb') : null;
			},
			hsl: function(str: string): IColor|null
			{
				const val: TColorValue|null = get_hsl(str);
				return val ? new Color(val, 'hsl') : null;
			},
			hwb: function(str: string): IColor|null
			{
				const val: TColorValue|null = get_hwb(str);
				return val ? new Color(val, 'hwb') : null;
			},
			value: function(...args: any[]): IColor|null
			{
				return Color.parse(args);
			},
		};
	}

	/**
	 * Parse color value
	 * 
	 * @param value - parse value ~ accepts `string` or `array` _(i.e. `TColorValue`)_ color value
	 * @param format - parse format (default: `rgb`)
	 * @returns `IColor` ~ `Color` instance or `null`
	 */
	static parse(value: any, format: TColorFormat = 'rgb'): IColor|null
	{
		try {
			let val: any = null;
			if (Array.isArray(value) && value.length){
				if (value.length === 1 && 'string' === typeof value[0]) val = value[0];
				else val = parse_args(value);
			}
			else val = value;
			if ([undefined, null, ''].includes(val)) return null;
			return new Color(val, format);
		}
		catch (err: any) {
			console.error(`Color.parse: ${err.message || err}`);
			return null;
		}
	}
}

/**
 * `Color<IColor>` class constructor interface
 */
export interface IColorConstructor {
	parse: (value: any, format?: TColorFormat) => IColor|null;
	from: IStaticColorFrom;
	to: IStaticColorTo;
}