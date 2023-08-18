import { Buffer } from 'buffer';
import { bool, BufferString, BufferEncoding } from '../types';
/**
 * Get unique string of random characters (in lowercase)
 *
 * @example
 * _uuid() => 'g9eem5try3pll9ue' 16
 * _uuid(20) => 'k6yo2zgzodjll9uers4u' 20
 * _uuid(7, 'test_') => 'test_3bmxj2t' 12
 * _uuid(7, 'test_{uuid}_example') => 'test_lk9r5tv_example' 20
 * _uuid(7, 'test_{uuid}_{uuid}_example') => 'test_g948vqf_0s6ms8y_example' 28
 *
 * @param length - uuid length - integer `number` min=`7`, max=`64` (default `16`)
 * @param template - uuid template - trimmed `string` ~ appends when `'{uuid}'` not in template
 * @returns unique `string` min-length = 7, max-length = 64
 */
export declare function _uuid(length?: number, template?: string): string;
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
export declare const _isUrl: (value: any, matchDataURI?: boolean) => boolean;
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
/**
 * Split `string` value into parts ~ part and separator array (last entry's separator is `''`)
 *
 * @param value - split string
 * @param separator - split separator (default: `undefined`)
 * @param limit - split items limit/count (default: `undefined`)
 * @returns `[part: string, separator: string | ''][]` parts
 */
export declare const _split: (value: any, separator?: string | RegExp, limit?: number) => [part: string, separator: string][];
/**
 * Basename (stringable) object interface
 */
export interface IBasename {
    value: any;
    basename: string;
    name: string;
    ext: string;
    toString: () => string;
    error: string;
    illegal: string[];
    invalid: string[];
}
/**
 * Basename error interface
 */
export interface IBasenameError extends Error {
    name: string;
    item: IBasename;
}
/**
 * Get validated basename from file path value
 * - splits path separators `[\\/]` uses last entry
 * - trims spaces, invalidates empty
 * - invalidates illegal characters (i.e. `:?"<>|*`)
 * - invalidates invalid names (i.e. `'...', 'name.', 'name...'`)
 *
 * @param value - parse path value
 * @param dots - allow dot nav ~ `'.' | '..'` (default: `false`)
 * @param _failure - error handling ~ `0` = ignore, '1' = warn, `2` = throw error (default `0`)
 * @returns `IBasename` basename (stringable)
 * @throws `IBasenameError`
 */
export declare const _basename: (value: any, dots?: boolean, _failure?: 0 | 1 | 2) => IBasename;
/**
 * Normalized path (stringable) interface
 */
export interface INormPath {
    value: any;
    root: string;
    drive: string;
    path: string;
    dir: string;
    basename: string;
    name: string;
    ext: string;
    toString: () => string;
    error: string;
    illegal: string[];
    invalid: string[];
}
/**
 * Normalized path error interface
 */
export interface INormPathError extends Error {
    name: string;
    item: INormPath;
}
/**
 * Get normalized file/directory path (validates basename)
 * - trims spaces, silently omits empty
 * - invalidates illegal path name characters (i.e. `:?"<>|*`)
 * - invalidates invalid path name dots (i.e. `'...', 'name.', 'name...'`)
 * - invalidates outbound root dot nav
 * - normalizes dot path			(i.e. `'/.'` => `'/'`, `'a/b/./c' => 'a/b/c'`, `'./a/../b/c' => './b/c'`) ignores out of bound (i.e. `'C:/a/../../b/c' => 'C:/b/c'`)
 * - normalizes drive letter	(i.e. `'c:\\a.txt' => 'C:\\a.txt'`, `'c:'` => `'C:\\'`)
 *
 * @param value - parse path value
 * @param separator - result path separator ~ `'' | '/' | '\\'` (default `''` = unchanged)
 * @param _type - path type (default `''`) ~ name used in error message (i.e. `'The ${_type} path...'`)
 * @param _failure - error handling ~ `0` = ignore, '1' = warn, `2` = throw error (default `0`)
 * @returns `INormPath` normalized path (stringable)
 */
export declare const _normPath: (value: any, separator?: '' | '/' | '\\', _type?: string, _failure?: 0 | 1 | 2) => INormPath;
