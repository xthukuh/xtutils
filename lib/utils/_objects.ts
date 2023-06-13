import { bool } from './_common';

/**
 * Flatten array recursively
 * 
 * @param values
 */
export const _flatten = (values: any[]): any[] => values.flat(Infinity);

/**
 * Check if value has property
 * 
 * @param value  Search `object` value
 * @param prop  Find property
 * @param own  [default: `false`] As own property
 * 
 */
export const _hasProp = (value: any, prop: any, own: bool = false): boolean => {
	if (!('object' === typeof value && value)) return false;
	return Object.prototype.hasOwnProperty.call(value, prop) || (own ? false : prop in value);
};

/**
 * Check if object has properties
 * 
 * @param value  Search `object` value
 * @param props  Spread find properties
 * 
 */
export const _hasProps = (value: any, ...props: any): boolean => !props.length ? false : !props.filter((k: any) => !_hasProp(value, k)).length;

/**
 * Check if object has any of the properties
 * 
 * @param value  Search `object` value
 * @param props  Spread find properties
 * 
 */
export const _hasAnyProps = (value: any, ...props: any): boolean => !props.length ? false : !!props.filter((k: any) => _hasProp(value, k)).length;