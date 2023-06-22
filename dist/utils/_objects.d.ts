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
