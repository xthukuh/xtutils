/**
 * Buffer encoding enum
 */
export declare enum BufferEncoding {
    ascii = "ascii",
    utf8 = "utf8",
    'utf-8' = "utf-8",
    utf16le = "utf16le",
    'utf-16le' = "utf-16le",
    ucs2 = "ucs2",
    'ucs-2' = "ucs-2",
    base64 = "base64",
    base64url = "base64url",
    latin1 = "latin1",
    binary = "binary",
    hex = "hex"
}
/**
 * Buffer encoding
 */
export type TBufferEncoding = BufferEncoding | keyof typeof BufferEncoding;
/**
 * Check if value is `Buffer`
 * - alias `Buffer.isBuffer(value)`
 *
 * @param value
 * @returns `boolean`
 */
export declare const _isBuffer: (value: any) => boolean;
/**
 * Check if value can be parsed to `Buffer`
 *
 * @param value
 * @returns `boolean`
 */
export declare const _isBufferType: (value: any) => boolean;
/**
 * Check if value is a valid `Buffer` encoding
 *
 * @param value
 * @returns `boolean`
 */
export declare const _isBufferEncoding: (value: any) => boolean;
/**
 * Base64 encode
 *
 * @example
 * _base64Encode('Hello world!') // 'SGVsbG8gd29ybGQh'
 *
 * @param buffer - encode `Buffer` or `string`
 * @param from_encoding - parse buffer encoding
 * @returns base64 encoded `string`
 */
export declare const _base64Encode: (buffer: any, from_encoding?: TBufferEncoding) => string;
/**
 * Base64 decode
 *
 * @example
 * _base64Decode('SGVsbG8gd29ybGQh') // 'Hello world!'
 *
 * @param buffer - decode `Buffer` or `string`
 * @param to_encoding - to string encoding
 * @returns decoded `Buffer`
 */
export declare const _base64Decode: (buffer: any, to_encoding?: TBufferEncoding) => string;
