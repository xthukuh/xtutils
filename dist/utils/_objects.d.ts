import { bool } from '../types';
/**
 * Flatten array recursively
 *
 * @param values
 */
export declare const _flatten: (values: any[]) => any[];
/**
 * Check if value has property
 *
 * @param value  Search `object` value
 * @param prop  Find property
 * @param own  [default: `false`] As own property
 *
 */
export declare const _hasProp: (value: any, prop: any, own?: bool) => boolean;
/**
 * Check if object has properties
 *
 * @param value  Search `object` value
 * @param props  Spread find properties
 *
 */
export declare const _hasProps: (value: any, ...props: any) => boolean;
/**
 * Check if object has any of the properties
 *
 * @param value  Search `object` value
 * @param props  Spread find properties
 *
 */
export declare const _hasAnyProps: (value: any, ...props: any) => boolean;
/**
 * Check if value is a class function
 *
 * @param value  Test value
 */
export declare const _isClass: (value: any) => boolean;
/**
 * Check if value is a function (or class optionally)
 *
 * @param value  Test value
 * @param orClass  [default: `false`] Includes class function
 */
export declare const _isFunc: (value: any, orClass?: boolean) => boolean;
/**
 * Get `[min, max]` compared and arranged
 * - Example: `_minMax(20, 10)` => `[10, 20]`
 * - Example: `_minMax(0.23, null)` => `[null, 0.23]`
 *
 * @param a  Compare value 1
 * @param b  Compare value 2
 * @returns `[min, max]`
 */
export declare const _minMax: (a: any, b: any) => [min: any, max: any];
/**
 * Flatten object values recursively to dot paths (i.e. `{a:{x:1},b:{y:2,z:[5,6]}}` => `{'a.x':1,'b.y':2,'b.z.0':5,'b.z.1':6}`)
 *
 * @param value  Parse object
 * @param omit  Omit entry keys/dot paths
 * @returns `{[key: string]: any}`
 */
export declare const _dotFlat: (value: any, omit?: string[]) => {
    [key: string]: any;
};
/**
 * Get validated object dot path (i.e. `'a.b.c'` to refer to `{a:{b:{c:1}}}`)
 *
 * @param dot_path - dot separated keys
 * @param operations - supports operations (i.e. '!reverse'/'!slice=0') ~ tests dot keys using `/^[-_0-9a-zA-Z]+\=([^\=\.]*)$/` instead of default `/^[-_0-9a-zA-Z]+$/`
 * @param _failure - error handling ~ `0` = (default) disabled, '1' = warn error, `2` = warn and throw error
 * @returns `string` valid dot path
 */
export declare const _validDotPath: (dot_path: string, operations?: boolean, _failure?: 0 | 1 | 2) => string;
/**
 * Get parsed `boolean` value
 *
 * @param value - parse value
 * @param strict - strict mode ~ support only `boolean-like` value (i.e. `'true'|'false'|true|false|1|0`) returns `undefined` if unsupported when enabled.
 * @param trim - trim `string` value (default `true`)
 * @returns
 * - `boolean`
 * - `undefined` when invalid if `strict` is enabled
 * - `'false' => false` | `!!value` when strict is disabled
 */
export declare const _bool: (value: any, strict?: boolean, trim?: boolean) => boolean | undefined;
/**
 * Resolve dot path object value ~ supports array operations chaining
 *
 * @example
 *
 * //simple usage
 * _dotGet('x', {x:1}) => 1
 * _dotGet('a.b.c', {a:{b:{c:1}}}) => 1
 * _dotGet('a.b.d', {a:{b:{c:1}}}, 'a.b.d', null) => null
 * _dotGet('a.0', {a:['x','y']}) => 'x'
 *
 * //array reverse operation
 * _dotGet('0.!reverse', [[1,2,3]]) => [3,2,1]
 *
 * //array slice operation
 * _dotGet('0.!slice', [[1,2,3]]) => [1,2,3]
 *
 * //array slice negative `-number`
 * _dotGet([[1,2,3]], '0.-2') => [2,3]
 *
 * //array `key=value` searching
 * _dotGet('0.a=2', [[{a:1,b:2},{a:2,b:3}]]) => {a:2,b:3}
 * _dotGet('0.a=1,b=2', [[{a:1,b:2,c:3}, {a:2,b:3,c:4}]]) => {a:1,b:2,c:3}
 *
 *
 * @param dot_path - dot separated keys ~ optional array operations
 * @param target - traverse object
 * @param _failure - error handling ~ `0` = (default) disabled, '1' = warn error, `2` = warn and throw error
 * @param _default - default result on failure
 * @returns `any` dot path match result
 */
export declare const _dotGet: (dot_path: string, target: any, _failure?: 0 | 1 | 2, _default?: any) => any;
/**
 * Get dot path value
 *
 * @param dot_path - dot separated keys ~ optional array operations
 * @param target - traverse object
 * @param _failure - error handling ~ `0` = (default) disabled, '1' = warn error, `2` = warn and throw error
 * @returns ``
 */
export declare const _dotValue: <TResult = any>(dot_path: string, target: any, _failure?: 0 | 1 | 2) => TResult | undefined;
/**
 * Get dump value with limit max string length
 *
 * @param value - parse value (`value = _jsonParse(_jsonStringify(value))`)
 * @param maxStrLength - max string length [default: `100`]
 * @returns `any` - parsed value
 */
export declare const _dumpVal: (value: any, maxStrLength?: number) => any;
/**
 * Get `Symbol.iterator` object values
 *
 * @param value - parse value
 * @param _nulls - disable `null`/`undefined` filter
 * @returns `any[]` ~ `[...any]` values
 */
export declare const _values: <T = any>(value: any, _nulls?: boolean) => T[];
