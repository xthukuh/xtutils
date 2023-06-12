import { bool } from '@/models/types';

/**
 * Create new `undefined` array of specified length
 * 
 * @param length  [default: `0`] Content length
 * 
 */
export const _array = (length: number=0): undefined[] => Array.from(Array(!isNaN(length = parseInt(length as any)) && length >= 0 ? length : 0));

/**
 * Flatten array recursively
 * 
 * @param values
 * 
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

/**
 * Check if value is array spreadable (i.e. [...value])
 * 
 * @param value
 * @returns
 */
export const _isSpreadable = (value: any): boolean => {
  try {
    if (Array.isArray([...value])) return true;
  }
  catch (e){}
  return false;
};

/**
 * Check if value is empty
 * 
 * @param value  Parse value
 * @param trim  Whether to trim `string` value
 * @param objects  Whether to check `object` value (considered not empty by default)
 * 
 */
export const _isEmpty = (value: any, trim: bool = false, objects: bool = false): boolean => {
  if (value === null || value === undefined) return true;
  if ('string' === typeof value) return !(trim ? value.trim() : value).length;
  if ('object' === typeof value && value){
    if (!objects) return false;
    if (_isSpreadable(value)) return ![...value].length;
    if (Object.getPrototypeOf(value) === Object.prototype && !Object.keys(value).length) return true;
    if (!String(value)) return true;
  }
  return false;
};