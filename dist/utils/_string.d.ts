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
 * Convert value to `string` equivalent
 *
 * - Returns '' for `null` and `undefined` value
 * - When `stringify` is `false`, returns '' for `array` or `object` value that does not implement `toString()` method
 *
 * @param value
 * @param trim  Trim result
 * @param stringify  Stringify `array` or `object` value that does not implement `toString()` method
 */
export declare const _str: (value: any, trim?: boolean, stringify?: boolean) => string;
/**
 * Normalize string by removing accents (i.e. "Amélie" => "Amelie")
 *
 * @param value
 */
export declare const _strNorm: (value: any) => string;
/**
 * Escape regex operators from string
 * - i.e. `'\\s\n\r\t\v\x00~_!@#$%^&*()[]\\/,.?"\':;{}|<>=+-'` => `'\\s\n\r\t\v\x00\s~_!@#\\$%\\^&\\*\\(\\)\\[\\]\\\\/,\\.\\?"\':;\\{\\}\\|<>=\\+-'`
 *
 * @param value
 */
export declare const _regEscape: (value: any) => string;
/**
 * Escape string special characters
 * - i.e. `'\r\n\t\f\v\x00-\u00f3-\u1234-\xb4-\u000b-/\\'` => `'\\r\\n\\t\\f\\v\\x00-ó-ሴ-´-\\v-/\\\\'`
 *
 * @param value
 */
export declare const _strEscape: (value: any) => string;
/**
 * Regex string trim characters
 *
 * @param value  Trim value
 * @param chars  Strip characters [default: `' \n\r\t\f\v\x00'`] - use `'{default}'` to include defaults (i.e `'-{defaults}'` == `'- \n\r\t\f\v\x00'`)
 * @param rl  Trim mode (`''` => (default) trim right & left, `'r'|'right'` => trim right, `'l'|'left'` => trim left)
 */
export declare const _trim: (value: any, chars?: string, rl?: '' | 'r' | 'l' | 'right' | 'left') => string;
/**
 * Regex string trim leading characters (left)
 *
 * @param value Trim value
 * @param chars Strip characters [default: `' \n\r\t\f\v\x00'`] - use `'{default}'` to include defaults (i.e `'-{defaults}'` == `'- \n\r\t\f\v\x00'`)
 */
export declare const _ltrim: (value: any, chars?: string) => string;
/**
 * Regex string trim trailing characters (right)
 *
 * @param value Trim value
 * @param chars Strip characters [default: `' \n\r\t\f\v\x00'`] - use `'{default}'` to include defaults (i.e `'-{defaults}'` == `'- \n\r\t\f\v\x00'`)
 */
export declare const _rtrim: (value: any, chars?: string) => string;
