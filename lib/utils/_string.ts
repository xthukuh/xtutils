import { bool } from './_common';
import { _jsonStringify } from './_json';

/**
 * Get unique string of random characters (in lowercase)
 * 
 * @param length  (max 64)
 */
export function _uuid(length?: number): string{
	const _uid = () => Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36);
	if (!(length !== undefined && Number.isInteger(length) && length > 0 && length <= 64)) return _uid();
	let buffer = '';
	while (buffer.length < length) buffer += _uid();
	return buffer.substring(0, length);
}

/**
 * Safely `string` cast value
 * - Returns ISO format timestamp for valid Date value
 * 
 * @param value  Cast value
 * @param _default  [default: `''`] Default result on failure
 */
export const _string = (value: any, _default: string = ''): string => {
	let val: string = '';
	try {
		if (value instanceof Date && !isNaN(value.getTime())) val = value.toISOString();
		else val = String(value);
	}
	catch (e){
		val = _default;
	}
	return val;
};

/**
 * Safely `string` cast value if possible.
 * 
 * @param value
 * @returns `false|string` Cast result or `false` on failure
 */
export const _stringable = (value: any): false|string => {
	const failed = `!${Date.now()}!`, val = _string(value, failed), pattern = /\[object \w+\]/;
	return !(val === failed || pattern.test(val)) ? val : false;
};

/**
 * Convert value to `string` equivalent
 * 
 * - Returns '' for `null` and `undefined` value
 * - When `stringify` is `false`, returns '' for `array` or `object` value that does not implement `toString()` method
 * 
 * @param value
 * @param trim  Trim result
 * @param stringify  Stringify `array` or `object` value that does not implement `toString()` method
 */
export const _str = (value: any, trim: boolean = false, stringify: boolean = false): string => {
	if ('string' !== typeof value){
		if (value === null || value === undefined) return '';
		else if ('object' === typeof value){
			if (Array.isArray(value)) return stringify ? _jsonStringify(value) : '';
			const tmp = _stringable(value);
			if (tmp === false) return stringify ? _jsonStringify(value) : '';
			else value = tmp;
		}
		else value = _string(value);
	}
	return trim ? value.trim() : value;
};

/**
 * Normalize string by removing accents (i.e. "Amélie" => "Amelie")
 * 
 * @param value
 */
export const _strNorm = (value: any): string => _str(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '');

/**
 * Escape regex operators from string
 * - i.e. `'\\s\n\r\t\v\x00~_!@#$%^&*()[]\\/,.?"\':;{}|<>=+-'` => `'\\s\n\r\t\v\x00\s~_!@#\\$%\\^&\\*\\(\\)\\[\\]\\\\/,\\.\\?"\':;\\{\\}\\|<>=\\+-'`
 * 
 * @param value
 */
export const _regEscape = (value: any): string => _str(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Escape string special characters
 * - i.e. `'\r\n\t\f\v\x00-\u00f3-\u1234-\xb4-\u000b-/\\'` => `'\\r\\n\\t\\f\\v\\x00-ó-ሴ-´-\\v-/\\\\'`
 * 
 * @param value
 */
export const _strEscape = (value: any): string => JSON.stringify(_str(value))
.replace(/\\u([\d\w]{4})/g, (m, s) => {
	const h = parseInt(s, 16);
	return h > 255 ? m : '\\' + encodeURIComponent(String.fromCharCode(h)).replace('%', 'x').replace('x0B', 'v');
})
.replace(/^"|"$/g, '')
.replace(/\\"/g, '"');

/**
 * Regex string trim characters
 * 
 * @param value  Trim value
 * @param chars  Strip characters [default: `' \n\r\t\f\v\x00'`] - use `'{default}'` to include defaults (i.e `'-{defaults}'` == `'- \n\r\t\f\v\x00'`)
 * @param rl  Trim mode (`''` => (default) trim right & left, `'r'|'right'` => trim right, `'l'|'left'` => trim left)
 */
export const _trim = (value: any, chars: string = ' \r\n\t\f\v\x00', rl: ''|'r'|'l'|'right'|'left' = ''): string => {
	value = _str(value);
	if (!chars.length) return value;
	chars = chars.replace(/\{default\}/, ' \r\n\t\f\v\x00');
	let d1 = 0, d2 = 0;
	let _chars: string[] = [...new Set([...chars])].filter(v => {
		if (v === '-'){
			d1 = 1;
			return false;
		}
		if (v === '_'){
			d2 = 1;
			return false;
		}
		return true;
	});
	if (d2) _chars.unshift('_');
	if (d1) _chars.unshift('-');
	let p = `[${_regEscape(_chars.join(''))}]*`, pattern = `^${p}|${p}$`;
	if (['l', 'left'].includes(rl)) pattern = `^${p}`;
	else if (['r', 'right'].includes(rl)) pattern = `${p}$`;
	return value.replace(new RegExp(pattern, 'gs'), '');
};

/**
 * Regex string trim leading characters (left)
 * 
 * @param value Trim value
 * @param chars Strip characters [default: `' \n\r\t\f\v\x00'`] - use `'{default}'` to include defaults (i.e `'-{defaults}'` == `'- \n\r\t\f\v\x00'`)
 */
export const _ltrim = (value: any, chars: string = ' \r\n\t\f\v\x00'): string => _trim(value, chars, 'left');

/**
 * Regex string trim trailing characters (right)
 * 
 * @param value Trim value
 * @param chars Strip characters [default: `' \n\r\t\f\v\x00'`] - use `'{default}'` to include defaults (i.e `'-{defaults}'` == `'- \n\r\t\f\v\x00'`)
 */
export const _rtrim = (value: any, chars: string = ' \r\n\t\f\v\x00'): string => _trim(value, chars, 'right');

/**
 * Convert string to title case (i.e. "heLLo woRld" => "Hello World")
 * 
 * @param value  Parse string
 * @param keepCase  Disable lowercasing uncapitalized characters
 */
export const _titleCase = (value: any, keepCase: bool = false): string => _str(value)
.replace(/\w\S*/g, match => match[0].toUpperCase()
+ (keepCase ? match.substring(1) : match.substring(1).toLowerCase()));

/**
 * Convert string to sentence case
 * 
 * @param value  Parse string
 * @param keepCase  Disable lowercasing uncapitalized characters
 */
export const _sentenceCase = (value: any, keepCase: bool = false): string => _str(value)
.split(/((?:\.|\?|!)\s*)/)
.map(val => {
  if (val.length){
    const first = val.charAt(0).toUpperCase();
    const rest = val.length > 1 ? val.slice(1) : '';
    val = first + (keepCase ? rest : rest.toLowerCase());
  }
  return val;
})
.join('');

/**
 * Convert value to snake case (i.e. 'HelloWorld' => 'hello_world')
 * - accents are normalized (i.e. "Test Amélie" => "test_amelie")
 * 
 * @param value  Parse string
 * @param trimTrailing  Trim trailing "_" (`false` = (default) disabled, `true` => trim right & left, `'r'|'right'` => trim right, `'l'|'left'` => trim left)
 */
export const _snakeCase = (value: any, trimTrailing: boolean|'l'|'left'|'r'|'right' = false): string => {
	let res = _strNorm(_trim(value))
	.replace(/[A-Z]+/g, m => m[0].toUpperCase() + m.substring(1).toLowerCase())
	.replace(/\W+/g, ' ')
	.split(/ |\B(?=[A-Z])/).join('_').replace(/_+/g, '_').toLowerCase();
	if (res === '_') return '';
	if (/^_|_$/.test(res) && trimTrailing) res = _trim(res, '_', (['l','left','r','right'].includes(trimTrailing as any) ? trimTrailing : '') as any);
	return res;
};

/**
 * Convert value to slug case (i.e. 'HelloWorld' => 'hello-world')
 * 
 * @param value  Parse string
 */
export const _slugCase = (value: any, trimTrailing: boolean|'l'|'left'|'r'|'right' = false): string => _snakeCase(value, trimTrailing).replace(/_/g, '-');

/**
 * Convert value to studly case (i.e. 'hello-world' => 'HelloWorld')
 * 
 * @param value  Parse string
 */
export const _studlyCase = (value: any): string => _snakeCase(value)
.split('_')
.filter(v => v.length)
.map(word => word[0].toUpperCase() + word.substring(1).toLowerCase())
.join('');

/**
 * Convert value to camel case (i.e. 'hello-world' => 'helloWorld')
 * 
 * @param value  Parse string
 */
export const _camelCase = (value: any): string => {
	let res = _studlyCase(value);
	if (res.length) res = res[0].toLowerCase() + res.substring(1);
	return res;
};