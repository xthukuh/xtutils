/**
 * Color Utils - [ported from color-string](https://github.com/Qix-/color-string)
 */

import { _str, _values } from '../utils';
import { ColorNames } from './_ColorNames';

/**
 * Mapped `ColorNames` - `[value => name]`
 */
const ColorValueName = Object.fromEntries(Object.entries(ColorNames).map(([key, value]) => [value, key]));

/**
 * Clamp a number between min and max
 * 
 * @param num - number to clamp
 * @param min - minimum value
 * @param max - maximum value
 * @returns `number`
 */
const clamp = (num: number, min: number, max: number): number => Math.min(Math.max(min, num), max);

/**
 * Convert a number to a hex string
 * 
 * @param num - number to convert
 * @returns `string`
 */
const hex_double = (num: number): string => Math.round(num).toString(16).toUpperCase().padStart(2, '0');

/**
 * Parse integer value
 * 
 * @param val - parse value
 * @returns `number` or `0`
 */
const parse_int = (val: any, _default: number = 0): number => parseInt(val) || _default;

/**
 * Parse float value
 * 
 * @param val - parse value
 * @returns `number` or `0`
 */
const parse_float = (val: any, _default: number = 0): number => parseFloat(val) || _default;

/**
 * Get color array value arguments
 * 
 * @param args - parse arguments
 * @returns `[number,number,number,number]` or `null`
 */
const parse_args = (args: any[], max: number): [number,number,number,number]|null => {
	const items: any[] = (Array.isArray(args) ? _values(args, false, false, -1) : [])
	.map((val, i) => i < 3 ? parse_int(val, NaN) : parse_float(val, NaN));
	if (items.filter(v => isNaN(v)).length) return null;
	if (items.length < 3) return null;
	const res: [number,number,number,number] = items.slice(0, 4).map((val, i) => {
		if (i < 3) return max === 360 && i ? clamp(val, 0, 100) : clamp(val, 0, max);
		return clamp(val, 0, 1);
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
const get_rgb = (str: string): [number,number,number,number]|null => {
	if (!(str = _str(str, true))) return null;
	const abbr = /^#([a-f0-9]{3,4})$/i;
	const hex = /^#([a-f0-9]{6})([a-f0-9]{2})?$/i;
	const rgba = /^rgba?\(\s*([+-]?\d+)(?=[\s,])\s*(?:,\s*)?([+-]?\d+)(?=[\s,])\s*(?:,\s*)?([+-]?\d+)\s*(?:[,|\/]\s*([+-]?[\d\.]+)(%?)\s*)?\)$/i;
	const per = /^rgba?\(\s*([+-]?[\d\.]+)\%\s*,?\s*([+-]?[\d\.]+)\%\s*,?\s*([+-]?[\d\.]+)\%\s*(?:[,|\/]\s*([+-]?[\d\.]+)(%?)\s*)?\)$/i;
	const keyword = /^(\w+)$/;
	let rgb: [number,number,number,number] = [0, 0, 0, 1];
	let match: RegExpMatchArray|null|string;
	let hexAlpha: string;
	if (match = str.match(hex)) {
		hexAlpha = match[2];
		match = match[1];
		for (let i = 0; i < 3; i ++) {
			// https://jsperf.com/slice-vs-substr-vs-substring-methods-long-string/19
			const i2 = i * 2;
			rgb[i] = parse_int(match.slice(i2, i2 + 2), 16);
		}
		if (hexAlpha) rgb[3] = parse_int(hexAlpha, 16) / 255;
	}
	else if (match = str.match(abbr)) {
		match = match[1];
		hexAlpha = match[3];
		for (let i = 0; i < 3; i ++) rgb[i] = parse_int(match[i] + match[i], 16);
		if (hexAlpha)  rgb[3] = parse_int(hexAlpha + hexAlpha, 16) / 255;
	}
	else if (match = str.match(rgba)) {
		for (let i = 0; i < 3; i ++) rgb[i] = parse_int(match[i + 1], 0);
		if (match[4]) {
			if (match[5]) rgb[3] = parse_float(match[4]) * 0.01;
			else rgb[3] = parse_float(match[4]);
		}
	}
	else if (match = str.match(per)) {
		for (let i = 0; i < 3; i ++) rgb[i] = Math.round(parse_float(match[i + 1]) * 2.55);
		if (match[4]) {
			if (match[5]) rgb[3] = parse_float(match[4]) * 0.01;
			else rgb[3] = parse_float(match[4]);
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
		rgb[i] = clamp(rgb[i], 0, 255);
	}
	rgb[3] = clamp(rgb[3], 0, 1);
	return rgb;
};

/**
 * Parse color `string` to HSL array values
 * 
 * @param str - parse string
 * @returns `[H,S,L,A]` or `null`
 */
const get_hsl = (str: string): [number,number,number,number]|null => {
	if (!(str = _str(str, true))) return null;
	const hsl = /^hsla?\(\s*([+-]?(?:\d{0,3}\.)?\d+)(?:deg)?\s*,?\s*([+-]?[\d\.]+)%\s*,?\s*([+-]?[\d\.]+)%\s*(?:[,|\/]\s*([+-]?(?=\.\d|\d)(?:0|[1-9]\d*)?(?:\.\d*)?(?:[eE][+-]?\d+)?)\s*)?\)$/i;
	const match: RegExpMatchArray|null = str.match(hsl);
	if (!match) return null;
	const alpha = parse_float(match[4]);
	const h = ((parse_float(match[1]) % 360) + 360) % 360;
	const s = clamp(parse_float(match[2]), 0, 100);
	const l = clamp(parse_float(match[3]), 0, 100);
	const a = clamp(isNaN(alpha) ? 1 : alpha, 0, 1);
	return [h, s, l, a];
};

/**
 * Parse color `string` to HWB array values
 * 
 * @param str - parse string
 * @returns `[H,W,B,A]` or `null`
 */
const get_hwb = (str: string): [number,number,number,number]|null => {
	if (!(str = _str(str, true))) return null;
	const hwb = /^hwb\(\s*([+-]?\d{0,3}(?:\.\d+)?)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?(?=\.\d|\d)(?:0|[1-9]\d*)?(?:\.\d*)?(?:[eE][+-]?\d+)?)\s*)?\)$/i;
	const match: RegExpMatchArray|null = str.match(hwb);
	if (!match) return null;
	const alpha = parse_float(match[4]);
	const h = ((parse_float(match[1]) % 360) + 360) % 360;
	const w = clamp(parse_float(match[2]), 0, 100);
	const b = clamp(parse_float(match[3]), 0, 100);
	const a = clamp(isNaN(alpha) ? 1 : alpha, 0, 1);
	return [h, w, b, a];
};

/**
 * Color model interface
 */
export interface IColorModel {
	model: string;
	value: [number,number,number,number];
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
	let value: [number,number,number,number]|null;
	let model: string;
	switch (prefix) {
		case 'hsl':
			value = get_hsl(str);
			model = 'hsl';
			break;
		case 'hwb':
			value = get_hwb(str);
			model = 'hwb';
			break;
		default:
			value = get_rgb(str);
			model = 'rgb';
			break;
	}
	return value ? {model, value} : null;
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
	return rgba.length < 4 || rgba[3] === 1
	? 'rgb(' + r + '%, ' + g + '%, ' + b + '%)'
	: 'rgba(' + r + '%, ' + g + '%, ' + b + '%, ' + rgba[3] + ')';
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
	return ColorValueName[rgba.slice(0, 3) as any] || '';
};

// TODO: implement @class Color, tests
