"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._sortValues = void 0;
/**
 * Sort array values
 *
 * @param array
 * @param sort
 * @returns Sorted `array`
 */
const _sortValues = (array, sort) => {
    const _compare = (a, b) => {
        if ('string' === typeof a && 'string' === typeof b && 'function' === typeof (a === null || a === void 0 ? void 0 : a.localeCompare))
            return a.localeCompare(b);
        return a > b ? 1 : (a < b ? -1 : 0);
    };
    const _direction = (val) => {
        if ('number' === typeof val && [1, -1].includes(val))
            return val;
        if ('string' === typeof val) {
            if (val.startsWith('asc'))
                return 1;
            if (val.startsWith('desc'))
                return -1;
        }
        return 1;
    };
    const _method = () => {
        if (Object(sort) === sort) {
            const _entries = Object.entries(sort);
            if (_entries.length)
                return (a, b) => {
                    let i, result;
                    for (result = 0, i = 0; result === 0 || i < _entries.length; i++) {
                        const [key, val] = _entries[i];
                        result = _compare(a === null || a === void 0 ? void 0 : a[key], b === null || b === void 0 ? void 0 : b[key]) * _direction(val);
                    }
                    return result;
                };
        }
        return (a, b) => _compare(a, b) * _direction(sort);
    };
    return array.sort(_method());
};
exports._sortValues = _sortValues;
