"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._utf8Decode = exports._utf8Encode = exports._unescape = exports._escape = void 0;
const _string_1 = require("./_string");
/**
 * The [escape()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/escape) function ~ _**deprecation-alt**_
 * - Replaces all characters with escape sequences, with the exception of ASCII word characters `(A–Z, a–z, 0–9, _)` and `@\*_+-./`.
 * - [EcmaScript spec](https://262.ecma-international.org/5.1/#sec-B.2.1)
 *
 * @param value - parse text
 * @returns `string` escaped text
 */
const _escape = (value) => {
    const text = (0, _string_1._str)(value);
    if (!text.length)
        return text;
    let buffer = '';
    const skip = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@*_+-./,';
    for (let i = 0; i < text.length; i++) {
        let char = text[i];
        if (skip.indexOf(char) < 0) {
            const ord = text.charCodeAt(i);
            char = ord < 256 ? '%' + ('00' + ord.toString(16)).toUpperCase().slice(-2) : '%u' + ('0000' + ord.toString(16)).toUpperCase().slice(-4);
        }
        buffer += char;
    }
    return buffer;
};
exports._escape = _escape;
/**
 * The [unescape()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/unescape) function ~ _**deprecation-alt**_
 * - Computes a new string in which hexadecimal escape sequences are replaced with the characters that they represent ~ _see `_escape()`_
 * - [EcmaScript spec](https://262.ecma-international.org/5.1/#sec-B.2.2)
 *
 * @param value - parse text
 * @returns `string` unescaped text
 */
const _unescape = (value) => {
    const text = (0, _string_1._str)(value), len = text.length;
    if (!len)
        return text;
    let buffer = '', k = 0;
    while (k < len) {
        let char = text[k];
        if (char === '%') { //7
            let chars = k <= (len - 6) && text[k + 1] === 'u' ? text.substring(k + 2, k + 6) : (k <= (len - 3) ? text.substring(k + 1, k + 3) : '');
            if (!/^[0-9A-F]+$/i.test(chars))
                chars = '';
            if (chars.length === 4) {
                char = String.fromCharCode(parseInt(chars, 16));
                k += 5;
            }
            else if (chars.length === 2) {
                char = String.fromCharCode(parseInt('00' + chars, 16));
                k += 2;
            }
        }
        buffer += char; //18
        k += 1;
    }
    return buffer;
};
exports._unescape = _unescape;
/**
 * UTF8 encode text ~ [REF](https://ecmanaut.blogspot.com/2006/07/encoding-decoding-utf8-in-javascript.html)
 *
 * @param value - parse text
 * @returns `string` UTF8 encoded text
 */
const _utf8Encode = (value) => (0, exports._unescape)(encodeURIComponent((0, _string_1._str)(value)));
exports._utf8Encode = _utf8Encode;
/**
 * UTF8 decode text
 *
 * @param value - parse text
 * @returns `string` UTF8 decoded text
 */
const _utf8Decode = (value) => decodeURIComponent((0, exports._escape)(value));
exports._utf8Decode = _utf8Decode;
//# sourceMappingURL=_utf8.js.map