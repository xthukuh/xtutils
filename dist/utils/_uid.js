"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._getUid = void 0;
/**
 * Get unique string of random characters (in lowercase)
 *
 * @param length  Max result length
 */
function _getUid(length) {
    const _uid = () => Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36);
    if (!(Number.isInteger(length) && length > 0 && Number.isFinite(length)))
        return _uid();
    let buffer = '';
    while (buffer.length < length)
        buffer += _uid();
    return buffer.substring(0, length);
}
exports._getUid = _getUid;
