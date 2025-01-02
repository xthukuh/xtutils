"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._clamp = exports._parse_float = exports._parse_int = exports._numk = exports._logx = exports._distance = exports._rad2deg = exports._deg2rad = exports._base2dec = exports._oct2dec = exports._dec2oct = exports._hex2dec = exports._dec2hex = exports._bin2dec = exports._dec2bin = exports._dec2base = exports._bytesVal = exports._px2rem = exports._rand = exports._commas = exports._round = exports._posInt = exports._int = exports._posNum = exports._num = exports._numeric = void 0;
/**
 * Check if value is numeric
 *
 * @param value  Parse value
 * @param booleans  Pass `boolean` values as numeric
 * @param blanks  Pass empty `string` values (because `!isNaN('') === true`)
 * @returns `boolean` is numeric
 */
const _numeric = (value, booleans = false, blanks = false) => {
    if ('number' === typeof value)
        return !isNaN(value);
    if ('boolean' === typeof value)
        return !!booleans;
    const v = String(value).trim();
    if (v === '')
        return !!blanks;
    return /(^[+-]?[0-9]+([.][0-9]+)?([eE][+-]?[0-9]+)?$)|(^[+-]?\.[0-9]+$)|(^[+-]?[0-9]+\.$)/.test(v);
};
exports._numeric = _numeric;
/**
 * Get parsed and normalized `number`
 *
 * - trims `string` value and `''` => `NaN`
 * - supports (#/#.#/.#/#.) & comma separated/spaced string (i.e. `'1, 200, 000 . 3455'` => `1200000.3455`)
 * - normalizes float `3+` last zeros from `5th` place (i.e. `1.1/100` = `0.011000000000000001` => `0.011`)
 *
 * @param value - parse number value
 * @param _default - default `number` result when invalid (default `NaN`)
 * @returns `number` | `NaN` when invalid or when `''`
 */
const _num = (value, _default = NaN) => {
    // parse string value
    if ('string' === typeof value) {
        // parse filled, single line text
        if ((value = value.trim()) && /^.*$/.test(value)) {
            // match leading +/- operator prefix
            let prefix = '';
            let match = value.trim().match(/^([\+-])\s*(\d.*)$/);
            if (match) {
                prefix = match[1]; // +|-
                value = match[2]; // value
            }
            // remove whitespace around [\d,\.]
            value = value.replace(/\s*([\.,])\s*/g, '$1');
            // match & remove "," thousand separator
            if (value.match(/^\d{1,3}(,\d{3})*(\.|(\.\d+))?$/))
                value = value.replace(/,/g, '').trim();
            // validate number format - allow (#/#.#/.#/#.)
            if (/^\d+\.$|^\.\d+$|^\d+(\.\d+){0,1}$/.test(value)) {
                // parse number & restore +/- operator prefix
                if (!isNaN(value = parseFloat(value)) && prefix)
                    value = parseFloat(prefix + value);
            }
            else
                value = NaN;
        }
        else
            value = NaN; // invalid number string
    }
    else
        value = Number(value); // coerce number
    // valid safe number => result
    let res;
    if (!isNaN(value = Number(value)) && value >= Number.MIN_SAFE_INTEGER && value <= Number.MAX_SAFE_INTEGER) {
        // check & normalize float `3+` last zeros from 5th place ~ 0.011000000000000001 => 0.011
        let match = String(value).match(/^([\+-]?\d+\.\d{5,})(0{3,}\d*)$/);
        if (match)
            value = Number(match[1]);
        // result
        res = value;
    }
    else
        res = _default; // invalid => default result
    return isNaN(res) ? _default : (!res ? 0 : res);
};
exports._num = _num;
/**
 * Get parsed safe positive `number` with optional within min/max limit check
 *
 * @param value - parse number value
 * @param min - set min limit ~ enabled when `min` is a valid positive number
 * @param max - set max limit ~ enabled when `max` is a valid positive number
 * @returns `number` positive | `undefined` when invalid or out of `min/max` bounds
 */
const _posNum = (value, min, max) => {
    const val = (0, exports._num)(value);
    if (!(!isNaN(val) && val >= 0))
        return undefined;
    if ('number' === typeof min && !isNaN(min) && min >= 0 && val < min)
        return undefined;
    if ('number' === typeof max && !isNaN(max) && max >= 0 && val > max)
        return undefined;
    return val;
};
exports._posNum = _posNum;
/**
 * Get parsed safe `integer` value
 *
 * @param value - parse number value
 * @param _default - result `number` when invalid (default `NaN`)
 * @returns `number` integer
 */
const _int = (value, _default = NaN) => {
    const val = Math.floor((0, exports._num)(value, _default));
    return !isNaN(val) ? val : _default;
};
exports._int = _int;
/**
 * Get parsed safe positive `integer` value with optional within min/max limit check
 *
 * @param value - parse number value
 * @param min - set min limit ~ enabled when `min` is a valid positive number
 * @param max - set max limit ~ enabled when `max` is a valid positive number
 * @param _limit_default - (default: `false`) use min/max value when value goes beyond limit (e.g. `_posInt(150,0,100,true)` => `100`)
 * @returns `number` positive | `undefined` when invalid or out of `min/max` bounds
 */
const _posInt = (value, min, max, _limit_default = false) => {
    const val = (0, exports._int)(value);
    if (!(!isNaN(val) && val >= 0))
        return undefined;
    if ('number' === typeof min && !isNaN(min) && min >= 0 && val < min)
        return _limit_default ? min : undefined;
    if ('number' === typeof max && !isNaN(max) && max >= 0 && val > max)
        return _limit_default ? max : undefined;
    return val;
};
exports._posInt = _posInt;
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
    let p = 10 ** Math.abs((0, exports._int)(places, 2));
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
/**
 * Convert px to rem (or reverse)
 *
 * @param val - convert value [default: `1`]
 * @param reverse - convert rem to px
 * @param base - root px [default: `16`]
 * @returns `number`
 */
const _px2rem = (val = 1, reverse = false, base = 16) => {
    val = (0, exports._num)(val, 1);
    base = (0, exports._num)(base, 16);
    const unit = base === 16 ? 0.0625 : 16 / base * 0.0625;
    return reverse ? val / unit : val * unit;
};
exports._px2rem = _px2rem;
/**
 * Convert bytes to size value
 *
 * @param bytes - parse bytes
 * @param mode - parse result mode (default: `0`)
 * - `0` = `string` size text (e.g. `_bytesVal(2097152)` => `2 MB`)
 * - `1` = `number` size value (e.g. `_bytesVal(2097152,1,'MB',0)` => `2`)
 * @param unit - size unit (default: `undefined` = max) ~ `'B'|'KB'|'MB'|'GB'|'TB'|'PB'|'EB'|'ZB'|'YB'`
 * @param places - decimal places
 * @returns `number`
 */
const _bytesVal = (bytes, mode = 0, unit, places = 2, commas = false) => {
    mode = (0, exports._posInt)(mode, 0, 1) ?? 0;
    if (!(bytes = (0, exports._posInt)(bytes, 0) ?? 0))
        return mode === 1 ? 0 : '0 B'; // -- zero
    const kb = 1024, units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const u = 'string' === typeof unit && units.includes(unit = unit.trim().toUpperCase()) ? unit : '';
    const i = u ? units.findIndex(v => v.toLowerCase() === u.toLowerCase()) : Math.floor(Math.log(bytes) / Math.log(kb));
    if (!(i >= 0 && i < units.length))
        return mode === 1 ? bytes : bytes + ' B'; // -- unsupported size (defaults to bytes)
    let val = bytes / Math.pow(kb, i);
    if (mode === 1)
        return (0, exports._round)(val, places);
    return (commas ? (0, exports._commas)(val, places) : (0, exports._round)(val, places)) + ' ' + units[i];
};
exports._bytesVal = _bytesVal;
/**
 * Convert decimal to base
 *
 * @example
 * _dec2base(126, 2) // '1111110'
 * _dec2base(126, 2, 4) // '0111 1110'
 * _dec2base(126, 8) // '176'
 * _dec2base(126, 16) // '7E'
 * _dec2base(1000, 16) // '03E8'
 * _dec2base(1000, 16, 2) // '03 E8'
 *
 * @param decimal - parse decimal integer
 * @param base - to base (default: `2`) ~ `2` = binary, `8` - octal, `16` - hexadecimal
 * @param group - space group characters length (default: `0`) ~ enabled when base = `2|16`
 * @returns `string`
 */
const _dec2base = (decimal, base = 2, group = 0) => {
    let dec = (0, exports._posInt)(decimal, 0) ?? 0;
    if (dec === 0)
        return '0';
    base = [2, 8, 16].includes(base = (0, exports._posInt)(base, 2) ?? 2) ? base : 2;
    const hex_chars = base === 16 ? '0123456789ABCDEF'.split('') : [];
    let val = '';
    while (dec > 0) {
        let remainder = dec % base;
        val = (base === 16 ? hex_chars[remainder] : remainder) + val;
        dec = Math.floor(dec / base);
    }
    if ([2, 16].includes(base) && !!(group = (0, exports._posInt)(group, 0) ?? 0)) {
        let buffer = '';
        while (val.length) {
            let i = val.length - group;
            buffer = val.substring(i).padStart(group, '0') + (buffer ? ' ' : '') + buffer;
            val = val.substring(0, i);
        }
        val = buffer;
    }
    return val;
};
exports._dec2base = _dec2base;
/**
 * Parse decimal to binary
 *
 * @example
 * _dec2bin(126) // 1111110
 * _dec2bin(126, 4) // 0111 1110
 * _dec2bin(126, 8) // 01111110
 *
 * @param decimal - parse decimal integer
 * @param group - space group characters length (default: `0`)
 * @returns `string` binary text
 */
const _dec2bin = (decimal, group = 0) => (0, exports._dec2base)(decimal, 2, group);
exports._dec2bin = _dec2bin;
/**
 * Parse binary to decimal
 *
 * @example
 * _bin2dec('0111 1110') // 126
 *
 * @param binary - parse binary text
 * @returns `number|undefined` ~ parsed decimal integer | `undefined` when invalid
 */
const _bin2dec = (binary) => {
    if (!('string' === typeof binary && /^[01]+$/.test(binary = binary.replace(/\s/g, ''))))
        return undefined; // -- invalid binary text
    let dec = 0, pow = 0;
    for (let i = binary.length - 1; i >= 0; i--) {
        dec += parseInt(binary[i]) * Math.pow(2, pow);
        pow++;
    }
    return dec;
};
exports._bin2dec = _bin2dec;
/**
 * Parse decimal to hexadecimal
 *
 * @example
 * _dec2hex(1000) // '03E8'
 * _dec2hex(1000, 2) // '03 E8'
 *
 * @param decimal - parse decimal integer `number`
 * @param group - space group characters length (default: `0`)
 * @returns `string` - hexadecimal text
 */
const _dec2hex = (decimal, group = 0) => (0, exports._dec2base)(decimal, 16, group);
exports._dec2hex = _dec2hex;
/**
 * Parse hexadecimal to decimal
 *
 * @example
 * _hex2dec('0x7E') // 126
 * _hex2dec('03 E8') // 1000
 *
 * @param hex - parse hexadecimal text
 * @returns `number|undefined` ~ parsed decimal integer | `undefined` when invalid
 */
const _hex2dec = (hex) => {
    if (!('string' === typeof hex && /^[0-9A-F]+$/.test(hex = hex.replace(/0x/ig, '').replace(/\s/g, '').toUpperCase())))
        return undefined; // -- invalid hexadecimal text
    const hex_map = Object.fromEntries('0123456789ABCDEF'.split('').map((v, i) => [v, i]));
    let dec = 0;
    for (let i = 0; i < hex.length; i++) {
        const val = hex_map[hex[i]];
        dec = dec * 16 + val;
    }
    return dec;
};
exports._hex2dec = _hex2dec;
/**
 * Parse decimal to octal
 *
 * @example
 * _dec2oct(126) // 176
 * _dec2oct(512) // 1000
 *
 * @param decimal - parse decimal integer `number`
 * @returns `string` - octal text
 */
const _dec2oct = (decimal) => (0, exports._dec2base)(decimal, 8);
exports._dec2oct = _dec2oct;
/**
 * Parse octal to decimal
 *
 * @example
 * _oct2dec('0o176') // 126
 * _oct2dec('1000') // 512
 *
 * @param octal - parse octal text
 * @returns `number|undefined` ~ parsed decimal integer | `undefined` when invalid
 */
const _oct2dec = (octal) => {
    if (!('string' === typeof octal && /^[0-7]+$/.test(octal = octal.replace(/0o/ig, '').replace(/\s/g, '').toUpperCase())))
        return undefined; // -- invalid octal text
    let dec = 0;
    for (let i = 0; i < octal.length; i++) {
        const val = octal[i] - 0;
        dec = dec * 8 + val;
    }
    return dec;
};
exports._oct2dec = _oct2dec;
/**
 * Parse text from base to decimal
 *
 * @example
 * _base2dec('0111 1110', 2) // 126
 * _base2dec('0o176', 8) // 126
 * _base2dec('0x7E', 16) // 126
 *
 * @param value - parse text
 * @param base - from base (default: `2`) ~ `2` = binary, `8` - octal, `16` - hexadecimal
 * @returns `number|undefined` ~ parsed decimal integer | `undefined` when invalid
 */
const _base2dec = (value, base = 2) => {
    base = [2, 8, 16].includes(base = (0, exports._posInt)(base, 2) ?? 2) ? base : 2;
    if (base === 2)
        return (0, exports._bin2dec)(value);
    else if (base === 8)
        return (0, exports._oct2dec)(value);
    return (0, exports._hex2dec)(value);
};
exports._base2dec = _base2dec;
/**
 * Convert degree to [radian](https://en.wikipedia.org/wiki/Radian)
 * - `2π rad = 360°` ∴ `radian = degree * π/180`
 *
 * @param degrees - angle in degrees (i.e. 0 - 360°)
 * @returns `number` - radian
 */
const _deg2rad = (degrees) => {
    if (isNaN(degrees = (0, exports._num)(degrees)))
        throw new TypeError('The _deg2rad `degrees` argument is not a valid angle number value.');
    return degrees * (Math.PI / 180);
};
exports._deg2rad = _deg2rad;
/**
 * Convert radian to [degree](https://en.wikipedia.org/wiki/Degree_(angle))
 * - `2π rad = 360°` ∴ `radian = degree * π/180`
 *
 * @param radians - angle in radians (i.e. 0 - 360°)
 * @returns `number` - degree
 */
const _rad2deg = (radians) => {
    if (isNaN(radians = (0, exports._num)(radians)))
        throw new TypeError('The _rad2deg `radians` argument is not a valid angle number value.');
    return radians * (180 / Math.PI);
};
exports._rad2deg = _rad2deg;
/**
 * Get distance in meters between two latitude and longitude coordinates
 *
 * @param latitude1 - first coordinate latitude `number`
 * @param longitude1 - first coordinate longitude `number`
 * @param latitude2 - second coordinate latitude `number`
 * @param longitude2 - second coordinate longitude `number`
 * @returns `number` `m` distance
 * @throws `TypeError` when coorinate argument value is `NaN`
 */
const _distance = (latitude1, longitude1, latitude2, longitude2) => {
    if (isNaN(latitude1 = (0, exports._num)(latitude1)))
        throw new TypeError('The _latLonDistance `latitude1` argument is not a valid latitude number value.');
    if (isNaN(longitude1 = (0, exports._num)(longitude1)))
        throw new TypeError('The _latLonDistance `longitude1` argument is not a valid longitude number value.');
    if (isNaN(latitude2 = (0, exports._num)(latitude2)))
        throw new TypeError('The _latLonDistance `latitude2` argument is not a valid latitude number value.');
    if (isNaN(longitude2 = (0, exports._num)(longitude2)))
        throw new TypeError('The _latLonDistance `longitude2` argument is not a valid longitude number value.');
    // const R = 6371e3; // Earth radius in meters
    const R = 6.378e+6; // Earth radius in meters
    const φ1 = latitude1 * Math.PI / 180; // φ, λ in radians
    const φ2 = latitude2 * Math.PI / 180;
    const Δφ = (latitude2 - latitude1) * Math.PI / 180;
    const Δλ = (longitude2 - longitude1) * Math.PI / 180;
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2); // square of half the chord length between the points using the Haversine formula.
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); // angular distance in radians.
    return R * c; // distance in meters
};
exports._distance = _distance;
/**
 * Get logarithm of value with custom base (i.e. `log_x * value = log * value/log * base`)
 * - power of base in value
 *
 * @param base - log base
 * @param value - log value
 * @returns `number` approximatted float
 */
const _logx = (base, value) => {
    if (isNaN(base = (0, exports._num)(base)))
        return NaN;
    if (isNaN(value = (0, exports._num)(value)))
        return NaN;
    return Math.log2(value) / Math.log2(base);
};
exports._logx = _logx;
/**
 * Get number in `k` (thousand)` to max `T` (trillion) SI Symbol value group
 * - `'k'` Thousand
 * - `'M'` Million
 * - `'B'` Billion
 * - `'T'` Trillion
 *
 * @param value - parse number
 * @param places - decimal places (0 - 3)
 * @returns `string` number text
 */
const _numk = (value, places = 1) => {
    if (isNaN(value = (0, exports._num)(value)))
        return NaN.toString();
    if (!value)
        return '0';
    places = (0, exports._posInt)(places, 0, 3, true) ?? 1;
    const k = 1e3, units = ['', 'k', 'M', 'B', 'T'], max_pow = units.length - 1;
    const n = value < 0 ? '-' : '', pow = Math.floor((0, exports._logx)(k, value = Math.abs(value)));
    const i = Math.min(pow, max_pow), unit = units[i];
    let val = (0, exports._round)(value / (k ** i), places);
    let text = `${n}${val}${unit}`;
    if (pow > max_pow) {
        const e = Math.floor(Math.log10(val));
        val = (0, exports._round)(val / (10 ** e), places);
        text = `${n}${val}e${e}${unit}`;
    }
    return text;
};
exports._numk = _numk;
/**
 * Parse integer value
 *
 * @param val - parse value
 * @returns `number` or `0`
 */
const _parse_int = (val, base, _default = 0) => {
    const res = parseInt(val, base);
    return isNaN(res) ? _default : (!res ? 0 : res);
};
exports._parse_int = _parse_int;
/**
 * Parse float value
 *
 * @param val - parse value
 * @returns `number` or `0`
 */
const _parse_float = (val, _default = 0) => {
    const res = parseFloat(val);
    return isNaN(res) ? _default : (!res ? 0 : res);
};
exports._parse_float = _parse_float;
/**
 * Clamp a number between min and max
 *
 * @param num - number to clamp
 * @param min - minimum value
 * @param max - maximum value
 * @returns `number`
 */
const _clamp = (num, min, max) => Math.min(Math.max((0, exports._num)(min), (0, exports._num)(num)), (0, exports._num)(max));
exports._clamp = _clamp;
//# sourceMappingURL=_number.js.map