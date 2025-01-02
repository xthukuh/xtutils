import { Buffer } from 'buffer';

/**
 * Buffer encoding enum
 */
export enum BufferEncoding {
	ascii = 'ascii',
	utf8 = 'utf8',
	'utf-8' = 'utf-8',
	utf16le = 'utf16le',
	'utf-16le' = 'utf-16le',
	ucs2 = 'ucs2',
	'ucs-2' = 'ucs-2',
	base64 = 'base64',
	base64url = 'base64url',
	latin1 = 'latin1',
	binary = 'binary',
	hex = 'hex',
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
export const _isBuffer = (value: any): boolean => Buffer.isBuffer(value);

/**
 * Check if value can be parsed to `Buffer`
 * 
 * @param value
 * @returns `boolean`
 */
export const _isBufferType = (value: any): boolean => {
	try {
		const buffer = Buffer.from(value);
		return buffer instanceof Buffer;
	}
	catch (_) {
		return false;
	}
};

/**
 * Check if value is a valid `Buffer` encoding
 * 
 * @param value
 * @returns `boolean`
 */
export const _isBufferEncoding = (value: any): boolean => Buffer.isEncoding(value);

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
export const _base64Encode = (buffer: any, from_encoding?: TBufferEncoding): string => {
	if (!_isBufferType(buffer)){
		console.error(`Invalid \`_base64Encode\` buffer argument type (${typeof buffer}).`);
		return '';
	}
	if (!from_encoding) from_encoding = undefined;
	if (!!from_encoding && !_isBufferEncoding(from_encoding)){
		console.error(`Unsupported \`_base64Encode\` - \`from_encoding\` argument value (${from_encoding}).`);
		from_encoding = undefined;
	}
	return Buffer.from(buffer, from_encoding).toString('base64');
};

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
export const _base64Decode = (buffer: any, to_encoding?: TBufferEncoding): string => {
	if (!_isBufferType(buffer)){
		console.error(`Invalid \`_base64Encode\` buffer argument type (${typeof buffer}).`);
		return '';
	}
	if (!to_encoding) to_encoding = undefined;
	if (!!to_encoding && !_isBufferEncoding(to_encoding)){
		console.error(`Unsupported \`_base64Decode\` - \`to_encoding\` argument value (${to_encoding}).`);
		to_encoding = undefined;
	}
	return Buffer.from(String(buffer), 'base64').toString(to_encoding);
};
