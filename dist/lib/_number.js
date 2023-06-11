"use strict";
//NUMBER UTILS
Object.defineProperty(exports, "__esModule", { value: true });
exports._rand = exports._commas = exports._round = exports._int = exports._num = exports._toNum = exports._isNumeric = void 0;
/**
 * Check if value is numeric
 *
 * @param value  Parse value
 * @param booleans  Pass `boolean` values as numeric
 * @param blanks  Pass empty `string` values (because `!isNaN('') === true`)
 * @returns `boolean` is numeric
 */
const _isNumeric = (value, booleans = false, blanks = false) => {
    if ('number' === typeof value)
        return !isNaN(value);
    if ('boolean' === typeof value)
        return !!booleans;
    const v = String(value).trim();
    if (v === '')
        return !!blanks;
    return /(^[+-]?[0-9]+([.][0-9]+)?([eE][+-]?[0-9]+)?$)|(^[+-]?\.[0-9]+$)|(^[+-]?[0-9]+\.$)/.test(v);
};
exports._isNumeric = _isNumeric;
/**
 * Convert value to normalized number
 *
 * - Blank trimmed `string` value is considered `NaN` (i.e. "")
 *
 * @param value  Parse value
 * @param _default  [default: `NaN`] Default result when parse result is `NaN`
 * @param fixFloat  [default: `true`] Whether to fix float zeros (i.e. `1.1/100` = `0.011000000000000001` => `0.011`)
 * @returns `number` parsed
 */
const _toNum = (value, _default = NaN, fixFloat = true) => {
    let num = value;
    if ('number' !== typeof value) {
        if ('string' === typeof value) {
            let p = /^\s*([\+-])\s*/, matches = value.match(p); //match prefix +/-
            if (matches)
                value = value.replace(p, ''); //remove prefix +/-
            value = value.replace(/^\s*[\+-]/, '').trim(); //remove prefix +/-
            if (value.match(/^\d{1,3}(,\d{3})*(\.|(\.\d+))?$/))
                value = value.replace(/,/g, '').trim(); //match and remove "," thousand separator
            if (!value.match(/^\d*(\.|(\.\d+))?$/))
                value = 'x'; //invalidate invalid leading decimal (i.e. '.10')
            else if (matches)
                value = matches[1] + value; //restore prefix +/-
        }
        num = !isNaN(num = Number(value)) ? num : parseFloat(num); //parse number
    }
    if (!(num !== '' && num !== null && !isNaN(num = Number(num))))
        return _default; //return default when value is not not numeric
    let val, matches, places = 5; //fix float - max 5 decimal places
    if (fixFloat && new RegExp(`\\.\\d*(0{${3}}\\d*)`).test(val = String(num)) && (matches = val.match(/\.(\d+)/))) {
        let floats = matches[1], len = floats.length, n = -1, x = -1;
        for (let i = len - 1; i >= 0; i--) {
            if (!Number(floats[i])) {
                if (x < 0)
                    x = i;
            }
            else if (x > -1) {
                n = i;
                if (x - n >= places)
                    break;
                else
                    x = n = -1;
            }
        }
        if (n > -1 && x > -1 && (x - n >= places))
            num = +val.substring(0, val.length - len + x + 1);
    }
    return num;
};
exports._toNum = _toNum;
/**
 * Parse value to number (shorthand)
 *
 * @param value  Parse value
 * @param _default  [default: `NaN`] Default result when parse result is `NaN`
 * @returns `number` parsed
 */
const _num = (value, _default = NaN) => (0, exports._toNum)(value, _default);
exports._num = _num;
/**
 * Parse value to integer
 *
 * @param value  Parse value
 * @param _default  [default: `NaN`] Default result when parse result is `NaN`
 * @returns `number` integer
 */
const _int = (value, _default = NaN) => parseInt(String((0, exports._toNum)(value, _default)));
exports._int = _int;
/**
 * Round number to decimal places
 *
 * @param value  Parse value
 * @param places  [default: `2`] Decimal places
 * @returns `number` rounded
 */
const _round = (value, places = 2) => {
    if (isNaN(value))
        return NaN;
    let p = Math.pow(10, Math.abs((0, exports._int)(places, 2)));
    return Math.round((value + Number.EPSILON) * p) / p;
};
exports._round = _round;
/**
 * Convert numeric value to comma thousand delimited string (i.e. `1000.4567` => `'1,000.45'`)
 *
 * @param value  Parse value
 * @param places  [default: `2`] Round decimal places
 * @param zeros  Enable trailing `'0'` decimal places (i.e. `1000` => `'1,000.00'`)
 * @returns `string` Comma thousand delimited number (returns `""` if parsed `value` is `NaN`)
 */
const _commas = (value, places = 2, zeros = false) => {
    const num = (0, exports._round)((0, exports._num)(value), places = (0, exports._int)(places, 2));
    if (isNaN(num)) {
        console.warn('[WARNING: `_commas`] NaN value:', value);
        return '';
    }
    let val = String(num).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    if (places && zeros) {
        if (val.indexOf('.') === -1)
            val += '.'.padEnd(places + 1, '0');
        else
            val = val.split('.').reduce((prev, v, i) => {
                prev.push(i === 1 && v.length < places ? v.padEnd(places, '0') : v);
                return prev;
            }, []).join('.');
    }
    return val;
};
exports._commas = _commas;
/**
 * Generate random `integer` number.
 *
 * @param min  Min `integer`
 * @param max  Max `integer`
 * @returns  `number` Random `integer`
 */
const _rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
exports._rand = _rand;
