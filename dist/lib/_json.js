"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._jsonClone = exports._jsonParse = exports._jsonStringify = void 0;
/**
 * Custom `JSON.stringify` with extended custom replacer
 * - Default value for `undefined` value argument
 * - Fix `Error`, `Set`, `Map` stringify
 * - Circular reference fixes
 *
 * @param value  Parse value (`undefined` value is replaced with `_undefined` argument substitute value)
 * @param space  Indentation space
 * @param _undefined  Default `undefined` argument `value` substitute (default `null`)
 * @returns
 */
const _jsonStringify = (value, space, _undefined = null) => {
    const _space = space === null ? undefined : space;
    const parents = [];
    const path = ['this'];
    const refs = new Map();
    const _clear = () => {
        refs.clear();
        parents.length = 0;
        path.length = 1;
    };
    const _parents = (key, value) => {
        let i = parents.length - 1, prev = parents[i];
        if (prev[key] === value || i === 0) {
            path.push(key);
            parents.push(value);
            return;
        }
        while (i-- >= 0) {
            prev = parents[i];
            if ((prev === null || prev === void 0 ? void 0 : prev[key]) === value) {
                i += 2;
                parents.length = i;
                path.length = i;
                --i;
                parents[i] = value;
                path[i] = key;
                break;
            }
        }
    };
    const _replacer = function (key, value) {
        if (value === null)
            return value;
        if (value instanceof Error)
            value = { [`[Error]`]: String(value) };
        if (value instanceof Set)
            value = { '[Set]': [...value] };
        if (value instanceof Map)
            value = { '[Map]': [...value] };
        if ('object' === typeof value) {
            if (key)
                _parents(key, value);
            const other = refs.get(value);
            if (other)
                return '[Circular]' + other;
            else
                refs.set(value, path.join('.'));
        }
        return value;
    };
    try {
        if (value === undefined)
            value = _undefined !== undefined ? _undefined : _undefined = null;
        parents.push(value);
        return JSON.stringify(value, _replacer, _space);
    }
    finally {
        _clear();
    }
};
exports._jsonStringify = _jsonStringify;
/**
 * Custom `JSON.parse` with error catch and default result on parse failure
 *
 * @param value
 * @param _default
 * @returns
 */
const _jsonParse = (value, _default) => {
    try {
        return JSON.parse(value);
    }
    catch (e) {
        return _default;
    }
};
exports._jsonParse = _jsonParse;
/**
 * Clone value via json stringify and parse
 *
 * @param value  Parse value
 * @param space  Indentation space
 * @param _undefined  Default `undefined` argument `value` substitute (default `null`)
 */
const _jsonClone = (value, space, _undefined = null) => {
    let val = (0, exports._jsonStringify)(value, space, _undefined);
    if (val !== undefined)
        val = (0, exports._jsonParse)(val);
    return val;
};
exports._jsonClone = _jsonClone;
