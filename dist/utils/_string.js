"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._regEscape = exports._str = exports._strNorm = exports._stringable = exports._string = exports._uuid = void 0;
const _json_1 = require("./_json");
/**
 * Get unique string of random characters (in lowercase)
 *
 * @param length  (max 64)
 */
function _uuid(length) {
    const _uid = () => Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36);
    if (!(length !== undefined && Number.isInteger(length) && length > 0 && length <= 64))
        return _uid();
    let buffer = '';
    while (buffer.length < length)
        buffer += _uid();
    return buffer.substring(0, length);
}
exports._uuid = _uuid;
/**
 * Safely `string` cast value
 * - Returns ISO format timestamp for valid Date value
 *
 * @param value  Cast value
 * @param _default  [default: `''`] Default result on failure
 * @returns `string`
 */
const _string = (value, _default = '') => {
    let val = '';
    try {
        if (value instanceof Date && !isNaN(value.getTime()))
            val = value.toISOString();
        else
            val = String(value);
    }
    catch (e) {
        val = _default;
    }
    return val;
};
exports._string = _string;
/**
 * Safely `string` cast value if possible.
 *
 * @param value
 * @returns `false|string` Cast result or `false` on failure
 */
const _stringable = (value) => {
    const failed = `!${Date.now()}!`, val = (0, exports._string)(value, failed), pattern = /\[object \w+\]/;
    return !(val === failed || pattern.test(val)) ? val : false;
};
exports._stringable = _stringable;
/**
 * Normalize string by removing accents (i.e. "Amélie" => "Amelie")
 *
 * @param value
 * @returns `string` normalized
 */
const _strNorm = (value) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
exports._strNorm = _strNorm;
/**
 * Convert value to `string` equivalent
 *
 * - Returns '' for `null` and `undefined` value
 * - When `stringify` is `false`, returns '' for `array` or `object` value that does not implement `toString()` method
 *
 * @param value
 * @param trim  Trim result
 * @param stringify  Stringify `array` or `object` value that does not implement `toString()` method
 * @returns  `string`
 */
const _str = (value, trim = false, stringify = false) => {
    if ('string' !== typeof value) {
        if (value === null || value === undefined)
            return '';
        else if ('object' === typeof value) {
            if (Array.isArray(value))
                return stringify ? (0, _json_1._jsonStringify)(value) : '';
            const tmp = (0, exports._stringable)(value);
            if (tmp === false)
                return stringify ? (0, _json_1._jsonStringify)(value) : '';
            else
                value = tmp;
        }
        else
            value = (0, exports._string)(value);
    }
    return trim ? value.trim() : value;
};
exports._str = _str;
/**
 * Escape regex operators from string
 * - i.e. `'~_!@#$%^&*()[]\\/,.?"\':;{}|<>=+-'` => `'~_!@#\\$%\\^&\\*\\(\\)\\[\\]\\\\/,\\.\\?"\':;\\{\\}\\|<>=\\+-'`
 *
 * @param value
 * @returns `string` escaped
 */
const _regEscape = (value) => (0, exports._str)(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
exports._regEscape = _regEscape;
//
// /**
//  * Trim string regex characters `[ \n\r\t\v\x00]*`
//  * 
//  * @param value  Trim string
//  * @param rl  [default: `both`] Trim direction `'r'|'right'` or `'l'/'left'` 
//  * @param chars  [default: `' \n\r\t\v\x00'`] Strip characters
//  * @returns `string` trimmed
//  */
// export const _trim = (value: string, rl?: string, chars: string = ' \n\r\t\v\x00'): string => {
//   rl = rl ? rl.trim().toLowerCase() : '';
//   let p = `[${_regEscape(chars)}]*`, pattern = `^${p}|${p}$`;
//   if (['l', 'left'].includes(rl)) pattern = `^${p}`;
//   else if (['r', 'right'].includes(rl)) pattern = `${p}$`;
//   return value.replace(new RegExp(pattern, 'g'), '');
// };
//
// /**
//  * Convert string to title case (i.e. "heLLo woRld" => "Hello World")
//  * 
//  * @param value
//  * @returns `string` Title Case
//  */
// export const _titleCase = (value: string): string => value.replace(/\w\S*/g, match => match[0].toUpperCase() + match.substring(1).toLowerCase());
//
// /**
//  * Convert string to sentence case
//  * 
//  * @param value  Parse value
//  * @param ignore  Ignore lowercasing
//  * @returns `string` Sentence case
//  */
// export const _sentenceCase = (value: string, ignore: bool = false): string => value.split(/((?<=\.|\?|!)\s*)/)
// .map(val => {
//   if (val.length){
//     const first = val.charAt(0).toUpperCase();
//     const rest = val.length > 1 ? val.slice(1) : '';
//     val = first + (ignore ? rest : rest.toLowerCase());
//   }
//   return val;
// })
// .join('');
//
// /**
//  * Convert value to snake case (i.e. 'HelloWorld' => 'hello_world')
//  * 
//  * @param value
//  * @returns `string` snake_case
//  */
// export const _snakeCase = (value: string): string => _strNorm(value).replace(/\W+/g, ' ').split(/ |\B(?=[A-Z])/).join('_').replace(/_+/g, '_').toLowerCase();
//
// /**
//  * Convert value to slug case (i.e. 'HelloWorld' => 'hello-world')
//  * 
//  * @param value
//  * @returns `string` slug-case
//  */
// export const _slugCase = (value: string): string => _strNorm(value).replace(/(?:[\W_])?[A-Z]/g, (m, i) => m.length === 1 && i ? '-' + m : m)
// .replace(/[0-9a-zA-Z]/, '-')
// .replace(/-+/g, '-')
// .toLowerCase();
//
// /**
//  * Convert value to studly case (i.e. 'hello-world' => 'HelloWorld')
//  * 
//  * @param value
//  * @returns `string` StudlyCase
//  */
// export const _studlyCase = (value: string): string => _slug(value).split('-').map(w => w[0].toUpperCase() + w.substring(1).toLowerCase()).join('');
