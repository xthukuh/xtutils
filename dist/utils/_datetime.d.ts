/**
 * Validate `Date` instance
 *
 * @param value
 */
export declare const _isDate: (value: any) => boolean;
/**
 * Get/create `Date` instance
 *
 * @param value  Parse value ~ `value instanceOf Date ? value : new Date(value)`
 * @param _default  Parse default on failure [default: `undefined` => `new Date()`]
 */
export declare const _getDate: (value?: any, _default?: Date | string | number | null | undefined) => Date;
/**
 * Convert `Date` value to datetime format (i.e. `2023-05-27 22:11:57` ~ `YYYY-MM-DD HH:mm:ss`)
 *
 * @param value  Parse value ~ `value instanceOf Date ? value : new Date(value)`
 * @param _default  Parse default on failure [default: `undefined` => `new Date()`]
 */
export declare const _datetime: (value?: any, _default?: Date | string | number | null | undefined) => string;
/**
 * Convert `Date` value to ISO format (i.e. `new Date().toISOString()` ~ `2023-05-27T19:30:44.575Z`)
 *
 * @param value  Parse value ~ `value instanceOf Date ? value : new Date(value)`
 * @param _default  Parse default on failure [default: `undefined` => `new Date()`]
 */
export declare const _timestamp: (value?: any, _default?: Date | string | number | null | undefined) => string;
