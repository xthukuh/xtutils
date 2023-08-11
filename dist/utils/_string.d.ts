import { Buffer } from 'buffer';
import { bool, BufferString, BufferEncoding } from '../types';
/**
 * Get unique string of random characters (in lowercase)
 *
 * @param length  Result length [min = 7, max = 64]
 * @returns unique `string` min-length = 7, max-length = 64
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
 * @returns value `string` | `false` on failure
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
 * @returns `string`
 */
export declare const _str: (value: any, trim?: boolean, stringify?: boolean) => string;
/**
 * Normalize string by removing accents (i.e. "Amélie" => "Amelie")
 *
 * @param value
 * @returns normalized `string`
 */
export declare const _strNorm: (value: any) => string;
/**
 * Escape regex operators from string
 * - i.e. `'\\s\n\r\t\v\x00~_!@#$%^&*()[]\\/,.?"\':;{}|<>=+-'` => `'\\s\n\r\t\v\x00\s~_!@#\\$%\\^&\\*\\(\\)\\[\\]\\\\/,\\.\\?"\':;\\{\\}\\|<>=\\+-'`
 *
 * @param value
 * @returns escaped `string`
 */
export declare const _regEscape: (value: any) => string;
/**
 * Escape string special characters
 * - i.e. `'\r\n\t\f\v\x00-\u00f3-\u1234-\xb4-\u000b-/\\'` => `'\\r\\n\\t\\f\\v\\x00-ó-ሴ-´-\\v-/\\\\'`
 *
 * @param value
 * @returns escaped `string`
 */
export declare const _strEscape: (value: any) => string;
/**
 * Regex string trim characters
 *
 * @param value  Trim value
 * @param chars  Strip characters [default: `' \n\r\t\f\v\x00'`] - use `'{default}'` to include defaults (i.e `'-{defaults}'` == `'- \n\r\t\f\v\x00'`)
 * @param rl  Trim mode (`''` => (default) trim right & left, `'r'|'right'` => trim right, `'l'|'left'` => trim left)
 * @returns trimmed `string`
 */
export declare const _trim: (value: any, chars?: string, rl?: '' | 'r' | 'l' | 'right' | 'left') => string;
/**
 * Regex string trim leading characters (left)
 *
 * @param value Trim value
 * @param chars Strip characters [default: `' \n\r\t\f\v\x00'`] - use `'{default}'` to include defaults (i.e `'-{defaults}'` == `'- \n\r\t\f\v\x00'`)
 * @returns left trimmed `string`
 */
export declare const _ltrim: (value: any, chars?: string) => string;
/**
 * Regex string trim trailing characters (right)
 *
 * @param value Trim value
 * @param chars Strip characters [default: `' \n\r\t\f\v\x00'`] - use `'{default}'` to include defaults (i.e `'-{defaults}'` == `'- \n\r\t\f\v\x00'`)
 * @returns right trimmed `string`
 */
export declare const _rtrim: (value: any, chars?: string) => string;
/**
 * Convert string to title case (i.e. "heLLo woRld" => "Hello World")
 *
 * @param value  Parse string
 * @param keepCase  Disable lowercasing uncapitalized characters
 * @returns Title Case `string`
 */
export declare const _toTitleCase: (value: any, keepCase?: bool) => string;
/**
 * Convert string to sentence case
 *
 * @param value  Parse string
 * @param keepCase  Disable lowercasing uncapitalized characters
 * @returns Sentence case `string`
 */
export declare const _toSentenceCase: (value: any, keepCase?: bool) => string;
/**
 * Convert value to snake case (i.e. 'HelloWorld' => 'hello_world')
 * - accents are normalized (i.e. "Test Amélie" => "test_amelie")
 *
 * @param value  Parse string
 * @param trimTrailing  Trim trailing "_" (`false` = (default) disabled, `true` => trim right & left, `'r'|'right'` => trim right, `'l'|'left'` => trim left)
 * @returns snake_case `string`
 */
export declare const _toSnakeCase: (value: any, trimTrailing?: boolean | 'l' | 'left' | 'r' | 'right') => string;
/**
 * Convert value to slug case (i.e. 'HelloWorld' => 'hello-world')
 *
 * @param value  Parse string
 * @returns slug-case `string`
 */
export declare const _toSlugCase: (value: any, trimTrailing?: boolean | 'l' | 'left' | 'r' | 'right') => string;
/**
 * Convert value to studly case (i.e. 'hello-world' => 'HelloWorld')
 *
 * @param value  Parse string
 * @returns StudlyCase `string`
 */
export declare const _toStudlyCase: (value: any) => string;
/**
 * Convert value to camel case (i.e. 'hello-world' => 'helloWorld')
 *
 * @param value  Parse string
 * @returns camelCase `string`
 */
export declare const _toCamelCase: (value: any) => string;
/**
 * Convert value to lower case sting
 *
 * @param value
 * @returns lowercase `string`
 */
export declare const _toLowerCase: (value: any) => string;
/**
 * Convert value to lower case sting
 *
 * @param value
 * @returns UPPERCASE `string`
 */
export declare const _toUpperCase: (value: any) => string;
/**
 * Get string buffer unique hash code (i.e. `hashCode('Hello world!')` => `-52966915`)
 *
 * @param buffer  Parse string value
 * @returns `number` hash
 */
export declare const _hashCode: (buffer: any) => number;
/**
 * Get string buffer hashCode (i.e. `_hash53('Hello world!')` => `5211024121371232` (length=16))
 * - A simple but high quality 53-bit string hash generator based on
 *   `cyrb53` script by `bryc` (https://stackoverflow.com/a/52171480/3735576)
 *
 * @param buffer  Parse string value
 * @param seed  Hash entropy
 * @returns `number` hash
 */
export declare const _hash53: (buffer: any, seed?: number) => number;
/**
 * Base64 encode
 * - Example: `_base64Encode('Hello world!')` => `'SGVsbG8gd29ybGQh'`
 *
 * @param buffer
 * @param bufferEncoding
 * @returns base64 encoded `string`
 */
export declare const _base64Encode: (buffer: BufferString, bufferEncoding?: BufferEncoding) => string;
/**
 * Base64 decode
 * - Example: `_base64Decode('SGVsbG8gd29ybGQh')` => `<Buffer 48 65 6c 6c 6f 20 77 6f 72 6c 64 21>`
 * - Example: `_base64Decode('SGVsbG8gd29ybGQh').toString()` => `'Hello world!'`
 *
 * @param base64
 * @returns decoded `Buffer`
 */
export declare const _base64Decode: (base64: string) => Buffer;
/**
 * Validate data URI `string` (i.e. `'data:image/jpeg;base64,/9j/4AAQSkZJRgABAgAAZABkAAD'`)
 *
 * @param value
 * @returns `boolean`
 */
export declare const _isDataURI: (value: any) => boolean;
/**
 * Validate URL `string`
 *
 * @param value
 * @param matchDataURI
 * @returns `boolean`
 */
export declare const _isURL: (value: any, matchDataURI?: boolean) => boolean;
/**
 * Validate email address `string`
 *
 * @param value
 * @returns `boolean`
 */
export declare const _isEmail: (value: any) => boolean;
/**
 * Escape `SQL` special characters from query `string` value
 *
 * @param value  Parse `string`
 * @returns Escaped `string`
 */
export declare const _escapeSql: (value: any) => string;
/**
 * Parse csv data into 2d string array
 *
 * @param text - parse text
 * @param delimiter - delimiter character (default: `','`)
 * @param br - new line (default: `'\n'`)
 * @returns `string[][]` ~ `[[...cols], ...rows]`
 */
export declare const _parseCsv: (text: string, delimiter?: string, br?: string) => string[][];
/**
 * Convert data to csv text
 *
 * @param data - parse data
 * @param delimiter - delimiter character (default: `','`)
 * @param br - new line replace (default: `'\n'`)
 * @returns `string` csv text
 */
export declare const _toCsv: (data: string | string[] | string[][], delimiter?: string, br?: string) => string;
