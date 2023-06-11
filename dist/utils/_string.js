"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._str = exports._strNorm = exports._stringable = exports._string = void 0;
const _json_1 = require("./_json");
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
