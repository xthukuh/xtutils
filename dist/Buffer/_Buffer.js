"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._base64Decode = exports._base64Encode = exports._isBufferEncoding = exports._isBufferType = exports._isBuffer = exports.BufferEncoding = void 0;
const buffer_1 = require("buffer");
/**
 * Buffer encoding enum
 */
var BufferEncoding;
(function (BufferEncoding) {
    BufferEncoding["ascii"] = "ascii";
    BufferEncoding["utf8"] = "utf8";
    BufferEncoding["utf-8"] = "utf-8";
    BufferEncoding["utf16le"] = "utf16le";
    BufferEncoding["utf-16le"] = "utf-16le";
    BufferEncoding["ucs2"] = "ucs2";
    BufferEncoding["ucs-2"] = "ucs-2";
    BufferEncoding["base64"] = "base64";
    BufferEncoding["base64url"] = "base64url";
    BufferEncoding["latin1"] = "latin1";
    BufferEncoding["binary"] = "binary";
    BufferEncoding["hex"] = "hex";
})(BufferEncoding || (exports.BufferEncoding = BufferEncoding = {}));
/**
 * Check if value is `Buffer`
 * - alias `Buffer.isBuffer(value)`
 *
 * @param value
 * @returns `boolean`
 */
const _isBuffer = (value) => buffer_1.Buffer.isBuffer(value);
exports._isBuffer = _isBuffer;
/**
 * Check if value can be parsed to `Buffer`
 *
 * @param value
 * @returns `boolean`
 */
const _isBufferType = (value) => {
    try {
        const buffer = buffer_1.Buffer.from(value);
        return buffer instanceof buffer_1.Buffer;
    }
    catch (_) {
        return false;
    }
};
exports._isBufferType = _isBufferType;
/**
 * Check if value is a valid `Buffer` encoding
 *
 * @param value
 * @returns `boolean`
 */
const _isBufferEncoding = (value) => buffer_1.Buffer.isEncoding(value);
exports._isBufferEncoding = _isBufferEncoding;
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
const _base64Encode = (buffer, from_encoding) => {
    if (!(0, exports._isBufferType)(buffer)) {
        console.error(`Invalid \`_base64Encode\` buffer argument type (${typeof buffer}).`);
        return '';
    }
    if (!from_encoding)
        from_encoding = undefined;
    if (!!from_encoding && !(0, exports._isBufferEncoding)(from_encoding)) {
        console.error(`Unsupported \`_base64Encode\` - \`from_encoding\` argument value (${from_encoding}).`);
        from_encoding = undefined;
    }
    return buffer_1.Buffer.from(buffer, from_encoding).toString('base64');
};
exports._base64Encode = _base64Encode;
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
const _base64Decode = (buffer, to_encoding) => {
    if (!(0, exports._isBufferType)(buffer)) {
        console.error(`Invalid \`_base64Encode\` buffer argument type (${typeof buffer}).`);
        return '';
    }
    if (!to_encoding)
        to_encoding = undefined;
    if (!!to_encoding && !(0, exports._isBufferEncoding)(to_encoding)) {
        console.error(`Unsupported \`_base64Decode\` - \`to_encoding\` argument value (${to_encoding}).`);
        to_encoding = undefined;
    }
    return buffer_1.Buffer.from(String(buffer), 'base64').toString(to_encoding);
};
exports._base64Decode = _base64Decode;
//# sourceMappingURL=_Buffer.js.map