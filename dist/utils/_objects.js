"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._hasAnyProps = exports._hasProps = exports._hasProp = exports._flatten = void 0;
/**
 * Flatten array recursively
 *
 * @param values
 */
const _flatten = (values) => values.flat(Infinity);
exports._flatten = _flatten;
/**
 * Check if value has property
 *
 * @param value  Search `object` value
 * @param prop  Find property
 * @param own  [default: `false`] As own property
 *
 */
const _hasProp = (value, prop, own = false) => {
    if (!('object' === typeof value && value))
        return false;
    return Object.prototype.hasOwnProperty.call(value, prop) || (own ? false : prop in value);
};
exports._hasProp = _hasProp;
/**
 * Check if object has properties
 *
 * @param value  Search `object` value
 * @param props  Spread find properties
 *
 */
const _hasProps = (value, ...props) => !props.length ? false : !props.filter((k) => !(0, exports._hasProp)(value, k)).length;
exports._hasProps = _hasProps;
/**
 * Check if object has any of the properties
 *
 * @param value  Search `object` value
 * @param props  Spread find properties
 *
 */
const _hasAnyProps = (value, ...props) => !props.length ? false : !!props.filter((k) => (0, exports._hasProp)(value, k)).length;
exports._hasAnyProps = _hasAnyProps;
