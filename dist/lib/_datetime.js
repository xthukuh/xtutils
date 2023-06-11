"use strict";
//DATE TIME UTILS
Object.defineProperty(exports, "__esModule", { value: true });
exports._timestamp = exports._datetime = exports._getDate = exports._isDate = void 0;
/**
 * Validate `Date` instance
 *
 * @param value
 */
const _isDate = (value) => value instanceof Date && !isNaN(value.getTime());
exports._isDate = _isDate;
/**
 * Get/create `Date` instance
 *
 * @param value  Parse value ~ `value instanceOf Date ? value : new Date(value)`
 * @param _default  Parse default on failure [default: `undefined` => `new Date()`]
 */
const _getDate = (value, _default) => {
    if (!(0, exports._isDate)(value) && !(0, exports._isDate)(value = new Date(value))) {
        if (_default instanceof Date)
            value = _default;
        else if (_default === undefined)
            value = new Date();
        else
            value = new Date(_default);
    }
    return value;
};
exports._getDate = _getDate;
/**
 * Convert `Date` value to datetime format (i.e. `2023-05-27 22:11:57` ~ `YYYY-MM-DD HH:mm:ss`)
 *
 * @param value  Parse value ~ `value instanceOf Date ? value : new Date(value)`
 * @param _default  Parse default on failure [default: `undefined` => `new Date()`]
 */
const _datetime = (value, _default) => {
    const date = (0, exports._getDate)(value, _default), _pad = (v) => `${v}`.padStart(2, '0');
    return !(0, exports._isDate)(date) ? `${date}` : `${date.getFullYear()}-${_pad(date.getMonth() + 1)}-${_pad(date.getDate())} ${_pad(date.getHours())}:${_pad(date.getMinutes())}:${_pad(date.getSeconds())}`;
};
exports._datetime = _datetime;
/**
 * Convert `Date` value to ISO format (i.e. `new Date().toISOString()` ~ `2023-05-27T19:30:44.575Z`)
 *
 * @param value  Parse value ~ `value instanceOf Date ? value : new Date(value)`
 * @param _default  Parse default on failure [default: `undefined` => `new Date()`]
 */
const _timestamp = (value, _default) => {
    const date = (0, exports._getDate)(value, _default);
    return !(0, exports._isDate)(date) ? `${date}` : date.toISOString();
};
exports._timestamp = _timestamp;
//..
/*
//TESTS:
console.log(`_getDate() => new Date() =>`, _getDate());
console.log(`_getDate('2023-05-27T19:30:44.575Z') =>`, _getDate('2023-05-27T19:30:44.575Z'));
console.log(`_getDate(1685215844575) =>`, _getDate(1685215844575));
console.log(`_getDate(NaN) => new Date() =>`, _getDate(NaN));
console.log(`_getDate(NaN, null) => `, _getDate(NaN, null));
console.log(`_getDate(NaN, new Date()) => `, _getDate(NaN, new Date()));
console.log(`_getDate(NaN, NaN) => `, _getDate(NaN, NaN));
console.log(`_getDate(NaN, 1685215844575) => `, _getDate(NaN, 1685215844575));
console.log(`_getDate(NaN, '2023-05-27T19:30:44.575Z') => `, _getDate(NaN, '2023-05-27T19:30:44.575Z'));
console.log(`_getDate(NaN, 'midnight') => `, _getDate(NaN, 'midnight'));

//RESULTS:
// _getDate() => new Date() => 2023-05-27T20:39:19.821Z
// _getDate('2023-05-27T19:30:44.575Z') => 2023-05-27T19:30:44.575Z
// _getDate(1685215844575) => 2023-05-27T19:30:44.575Z
// _getDate(NaN) => new Date() => 2023-05-27T20:39:19.823Z
// _getDate(NaN, null) =>  1970-01-01T00:00:00.000Z
// _getDate(NaN, new Date()) =>  2023-05-27T20:39:19.824Z
// _getDate(NaN, NaN) =>  Invalid Date
// _getDate(NaN, 1685215844575) =>  2023-05-27T19:30:44.575Z
// _getDate(NaN, '2023-05-27T19:30:44.575Z') =>  2023-05-27T19:30:44.575Z
// _getDate(NaN, 'midnight') =>  Invalid Date
*/ 
