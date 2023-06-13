import { bool } from './_common';
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
