import { Buffer } from 'buffer';
import { bool, BufferString, BufferEncoding } from '../types';
import { _jsonStringify } from './_json';

/**
 * Get unique string of random characters (in lowercase)
 * 
 * @param length  Result length [min = 7, max = 64]
 * @returns unique `string` min-length = 7, max-length = 64
 */
export function _uuid(length?: number): string{
	const _uid = () => Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36);
	if (!(length !== undefined && Number.isInteger(length) && length > 0 && length <= 64)) return _uid();
	length = length < 7 ? 7 : (length > 64 ? 64 : length);
	let buffer = '';
	while (buffer.length < length) buffer += _uid();
	return buffer.substring(0, length);
	//TODO: _uuid - template
	//return !(template = getAlphan(template)).length ? uid : template.match(p = /:uid/ig) ? template.replace(p, uid) : `${template}-${uid}`;
}

/**
 * Safely `string` cast value
 * - Returns ISO format timestamp for valid Date value
 * 
 * @param value  Cast value
 * @param _default  [default: `''`] Default result on failure
 * @returns `string`
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
 * @returns value `string` | `false` on failure
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
 * @returns `string`
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
 * @returns normalized `string`
 */
export const _strNorm = (value: any): string => _str(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '');

/**
 * Escape regex operators from string
 * - i.e. `'\\s\n\r\t\v\x00~_!@#$%^&*()[]\\/,.?"\':;{}|<>=+-'` => `'\\s\n\r\t\v\x00\s~_!@#\\$%\\^&\\*\\(\\)\\[\\]\\\\/,\\.\\?"\':;\\{\\}\\|<>=\\+-'`
 * 
 * @param value
 * @returns escaped `string`
 */
export const _regEscape = (value: any): string => _str(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Escape string special characters
 * - i.e. `'\r\n\t\f\v\x00-\u00f3-\u1234-\xb4-\u000b-/\\'` => `'\\r\\n\\t\\f\\v\\x00-ó-ሴ-´-\\v-/\\\\'`
 * 
 * @param value
 * @returns escaped `string`
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
 * @returns trimmed `string`
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
 * @returns left trimmed `string`
 */
export const _ltrim = (value: any, chars: string = ' \r\n\t\f\v\x00'): string => _trim(value, chars, 'left');

/**
 * Regex string trim trailing characters (right)
 * 
 * @param value Trim value
 * @param chars Strip characters [default: `' \n\r\t\f\v\x00'`] - use `'{default}'` to include defaults (i.e `'-{defaults}'` == `'- \n\r\t\f\v\x00'`)
 * @returns right trimmed `string`
 */
export const _rtrim = (value: any, chars: string = ' \r\n\t\f\v\x00'): string => _trim(value, chars, 'right');

/**
 * Convert string to title case (i.e. "heLLo woRld" => "Hello World")
 * 
 * @param value  Parse string
 * @param keepCase  Disable lowercasing uncapitalized characters
 * @returns Title Case `string`
 */
export const _toTitleCase = (value: any, keepCase: bool = false): string => _str(value)
.replace(/\w\S*/g, match => match[0].toUpperCase()
+ (keepCase ? match.substring(1) : match.substring(1).toLowerCase()));

/**
 * Convert string to sentence case
 * 
 * @param value  Parse string
 * @param keepCase  Disable lowercasing uncapitalized characters
 * @returns Sentence case `string`
 */
export const _toSentenceCase = (value: any, keepCase: bool = false): string => _str(value)
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
 * @returns snake_case `string`
 */
export const _toSnakeCase = (value: any, trimTrailing: boolean|'l'|'left'|'r'|'right' = false): string => {
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
 * @returns slug-case `string`
 */
export const _toSlugCase = (value: any, trimTrailing: boolean|'l'|'left'|'r'|'right' = false): string => _toSnakeCase(value, trimTrailing).replace(/_/g, '-');

/**
 * Convert value to studly case (i.e. 'hello-world' => 'HelloWorld')
 * 
 * @param value  Parse string
 * @returns StudlyCase `string`
 */
export const _toStudlyCase = (value: any): string => _toSnakeCase(value)
.split('_')
.filter(v => v.length)
.map(word => word[0].toUpperCase() + word.substring(1).toLowerCase())
.join('');

/**
 * Convert value to camel case (i.e. 'hello-world' => 'helloWorld')
 * 
 * @param value  Parse string
 * @returns camelCase `string`
 */
export const _toCamelCase = (value: any): string => {
	let res = _toStudlyCase(value);
	if (res.length) res = res[0].toLowerCase() + res.substring(1);
	return res;
};

/**
 * Convert value to lower case sting
 * 
 * @param value
 * @returns lowercase `string`
 */
export const _toLowerCase = (value: any): string => _str(value).toLowerCase();

/**
 * Convert value to lower case sting
 * 
 * @param value
 * @returns UPPERCASE `string`
 */
export const _toUpperCase = (value: any): string => _str(value).toUpperCase();

/**
 * Get string buffer unique hash code (i.e. `hashCode('Hello world!')` => `-52966915`)
 * 
 * @param buffer  Parse string value
 * @returns `number` hash
 */
export const _hashCode = (buffer: any): number => {
  let hash = 0;
  if (!(buffer = _str(buffer))) return hash;
  for (let i = 0; i < buffer.length; i ++){
    let chr = buffer.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; //Convert to 32bit integer
  }
  return hash;
};

/**
 * Get string buffer hashCode (i.e. `_hash53('Hello world!')` => `5211024121371232` (length=16))
 * - A simple but high quality 53-bit string hash generator based on
 *   `cyrb53` script by `bryc` (https://stackoverflow.com/a/52171480/3735576)
 * 
 * @param buffer  Parse string value
 * @param seed  Hash entropy
 * @returns `number` hash
 */
export const _hash53 = (buffer: any, seed: number = 0): number => {
	if (isNaN(seed)) seed = 0;
	let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
	for (let i = 0, ch; i < buffer.length; i++){
		ch = buffer.charCodeAt(i);
		h1 = Math.imul(h1 ^ ch, 2654435761);
		h2 = Math.imul(h2 ^ ch, 1597334677);
	}
	h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
	h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
	return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

/**
 * Base64 encode
 * - Example: `_base64Encode('Hello world!')` => `'SGVsbG8gd29ybGQh'`
 * 
 * @param buffer
 * @param bufferEncoding
 * @returns base64 encoded `string`
 */
export const _base64Encode = (buffer: BufferString, bufferEncoding?: BufferEncoding): string => {
	return Buffer.from(buffer, bufferEncoding).toString('base64');
};

/**
 * Base64 decode
 * - Example: `_base64Decode('SGVsbG8gd29ybGQh')` => `<Buffer 48 65 6c 6c 6f 20 77 6f 72 6c 64 21>`
 * - Example: `_base64Decode('SGVsbG8gd29ybGQh').toString()` => `'Hello world!'`
 * 
 * @param base64
 * @returns decoded `Buffer`
 */
export const _base64Decode = (base64: string): Buffer => {
	return Buffer.from(base64, 'base64');
};


/**
 * Validate data URI `string` (i.e. `'data:image/jpeg;base64,/9j/4AAQSkZJRgABAgAAZABkAAD'`)
 * 
 * @param value
 * @returns `boolean`
 */
export const _isDataURI = (value: any): boolean => {
	if (!(value && 'string' === typeof value && value.trim())) return false;
	return new RegExp(/^(data:)([\w\/\+-]*)(;charset=[\w-]+|;base64){0,1},(.*)/gi).test(value);
}

/**
 * Validate URL `string`
 * 
 * @param value
 * @param matchDataURI
 * @returns `boolean`
 */
export const _isURL = (value: any, matchDataURI: boolean = false): boolean => {
	if (!(value && 'string' === typeof value && value.trim())) return false;
	if (matchDataURI && _isDataURI(value)) return true;
	const pattern = '^(https?:\\/\\/)?'  // protocol
	+ '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'  // domain name
	+ '((\\d{1,3}\\.){3}\\d{1,3}))'  // or IP (v4) address
	+ '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'  // port and path
	+ '(\\?[;&a-z\\d%_.~+=-]*)?' // query string
	+ '(\\#[-a-z\\d_]*)?$'; // fragment locator
	//TODO: (from yup) let rUrl =
	//   eslint-disable-next-line
	//   /^((https?|ftp):)?\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
	return new RegExp(pattern, 'i').test(value);
}

/**
 * Validate email address `string`
 * 
 * @param value
 * @returns `boolean`
 */
export const _isEmail = (value: any): boolean => {
	if (!(value && 'string' === typeof value && value.trim())) return false;
	//TODO: (from yup) let rEmail =
	//  eslint-disable-next-line
	//  /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
	return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value.toLowerCase());
};

/**
 * Escape `SQL` special characters from query `string` value
 * 
 * @param value  Parse `string`
 * @returns Escaped `string`
 */
export const _escapeSql = (value: any): string => {
	if (!(value = _str(value))) return value;
	const chars = ['\\', '\'', '\"', '\b', '\n', '\r', '\t', '\x1a'];
	chars.forEach(char => value = value.replace(new RegExp(char, 'g'), '\\' + char));
	return value;
};

/**
 * Parse csv data into 2d string array
 * 
 * @param text - parse text
 * @param delimiter - delimiter character (default: `','`)
 * @param br - new line (default: `'\n'`)
 * @returns `string[][]` ~ `[[...cols], ...rows]`
 */
export const _parseCsv = (text: string, delimiter?: string, br?: string): string[][] => {
	const n_sep = '\x1D'; const n_sep_re = new RegExp(n_sep, 'g');
	const q_sep = '\x1E'; const q_sep_re = new RegExp(q_sep, 'g');
	const c_sep = '\x1F'; const c_sep_re = new RegExp(c_sep, 'g');
	const delim: string = (delimiter = _str(delimiter, true)).length === 1 ? delimiter : ',';
	const field_re = new RegExp('(^|[' + delim + '\\n])"([^"]*(?:""[^"]*)*)"(?=($|[' + delim + '\\n]))', 'g');
	return _str(text, true)
	.replace(/\r/g, '')
	.replace(/\n+$/, '')
	.replace(field_re, (_: string, p1: string, p2: string) => p1 + p2.replace(/\n/g, n_sep).replace(/""/g, q_sep).replace(/,/g, c_sep))
	.split(/\n/)
	.filter(line => line.length) 
	.map(line => line.split(delim).map(cell => cell.replace(n_sep_re, br ?? '\n').replace(q_sep_re, '"').replace(c_sep_re, ',')));
};

/**
 * Convert data to csv text
 * 
 * @param data - parse data
 * @param delimiter - delimiter character (default: `','`)
 * @param br - new line replace (default: `'\n'`)
 * @returns `string` csv text
 */
export const _toCsv = (data: string|string[]|string[][], delimiter?: string, br?: string): string => {
	const delim: string = (delimiter = _str(delimiter, true)).length === 1 ? delimiter : ',';
	const rows: string[][] = [];
	const _cell = (value: any): string => {
		let val: string = _str(value);
		if (!val.length) return val;
		if ('string' === typeof br && val.indexOf(br) > -1 && br !== '\n') val = val.replace(new RegExp(br, 'g'), '\n');
		val = val.replace(/\r/g, '').replace(/\n+$/, '').replace(/"/g, '""');
		if (val.indexOf(delim) > -1 || val.indexOf('"') > -1 || val.indexOf('\n') > -1 || /^\s+|\s+$/.test(val)) val = `"${val}"`;
		return val;
	};
	if (data && 'object' === typeof data && data[Symbol.iterator]){
		const values = Object.values([...data]);
		if (values.filter(v => 'object' === typeof v && v[Symbol.iterator]).length) rows.push(...values.map((r: any) => r.map((c: any) => _cell(c))));
		else rows.push(values.map((c: any) => _cell(c)));
	}
	else if (data = _str(data, true)) rows.push(..._parseCsv(data, delim, br).map(r => r.map(c => _cell(c))));
	return rows.map(cols => cols.join(delim)).filter(v => v.length).join('\n');
};