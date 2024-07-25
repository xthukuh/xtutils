"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._base64Decode = exports._base64Encode = exports._isBuffer = exports.Buffer = void 0;
const buffer_1 = require("buffer");
/**
 * Buffer object
 */
exports.Buffer = buffer_1.Buffer;
/**
 * Check if value is valid length
 *
 * @param value
 * @returns `boolean`
 */
const _isBuffer = (value) => exports.Buffer.isBuffer(value);
exports._isBuffer = _isBuffer;
/**
 * Base64 encode
 * - Example: `_base64Encode('Hello world!')` => `'SGVsbG8gd29ybGQh'`
 *
 * @param buffer
 * @param bufferEncoding
 * @returns base64 encoded `string`
 */
const _base64Encode = (buffer, bufferEncoding) => {
    return exports.Buffer.from(buffer, bufferEncoding).toString('base64');
};
exports._base64Encode = _base64Encode;
/**
 * Base64 decode
 * - Example: `_base64Decode('SGVsbG8gd29ybGQh')` => `<Buffer 48 65 6c 6c 6f 20 77 6f 72 6c 64 21>`
 * - Example: `_base64Decode('SGVsbG8gd29ybGQh').toString()` => `'Hello world!'`
 *
 * @param base64
 * @returns decoded `Buffer`
 */
const _base64Decode = (base64) => {
    return exports.Buffer.from(base64, 'base64');
};
exports._base64Decode = _base64Decode;
//# sourceMappingURL=_Buffer.js.map