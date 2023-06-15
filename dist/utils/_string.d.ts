/**
 * Get unique string of random characters (in lowercase)
 *
 * @param length  (max 64)
 */
export declare function _uuid(length?: number): string;
/**
 * Safely `string` cast value
 * - Returns ISO format timestamp for valid Date value
 *
 * @param value  Cast value
 * @param _default  [default: `''`] Default result on failure
 * @returns `string`
 */
export declare const _string: (value: any, _default?: string) => string;
/**
 * Safely `string` cast value if possible.
 *
 * @param value
 * @returns `false|string` Cast result or `false` on failure
 */
export declare const _stringable: (value: any) => false | string;
/**
 * Normalize string by removing accents (i.e. "Amélie" => "Amelie")
 *
 * @param value
 * @returns `string` normalized
 */
export declare const _strNorm: (value: string) => string;
/**
 * Convert value to `string` equivalent
 *
 * - Returns '' for `null` and `undefined` value
 * - When `stringify` is `false`, returns '' for `array` or `object` value that does not implement `toString()` method
 *
 * @param value
 * @param trim  Trim result
 * @param stringify  Stringify `array` or `object` value that does not implement `toString()` method
 * @returns  `string`
 */
export declare const _str: (value: any, trim?: boolean, stringify?: boolean) => string;
/**
 * Escape regex operators from string
 * - i.e. `'\\s\n\r\t\v\x00~_!@#$%^&*()[]\\/,.?"\':;{}|<>=+-'` => `'\\s\n\r\t\v\x00\s~_!@#\\$%\\^&\\*\\(\\)\\[\\]\\\\/,\\.\\?"\':;\\{\\}\\|<>=\\+-'`
 *
 * @param value
 * @returns `string` escaped
 */
export declare const _regEscape: (value: any) => string;
/**
 * Escape string special characters
 * - i.e. `'\n\r\t\v\x00'` => `'\\n\\r\\t\\v\\x00'`
 *
 * @param value
 * @returns `string` escaped
 */
export declare const _strEscape: (value: any) => string;
/**
 * Trim string regex characters `[ \n\r\t\v\x00]*`
 *
 * @param value  Trim string
 * @param rl  [default: `both`] Trim direction `'r'|'right'` or `'l'/'left'`
 * @param chars  [default: `' \n\r\t\v\x00'`] Strip characters
 * @returns `string` trimmed
 */
export declare const _trim: (value: string, rl?: '' | 'r' | 'l' | 'right' | 'left', chars?: string) => string;
