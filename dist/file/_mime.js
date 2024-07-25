"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._mime = exports.EXT_MIMES = void 0;
const utils_1 = require("../utils");
/**
 * File extension mime types
 */
exports.EXT_MIMES = require('./__mimes.json');
/**
 * Parse file mime type
 *
 * @example String(_mime('application/json; charset=utf-8')) => 'application/json'
 *
 * @param value - parse mime type
 * @param _failure - `FailError` mode ~ `0` = silent (default) | `1` = logs warning | `2` = logs error | `3` = throws error
 * @returns `IMimeType` stringable mime type object
 */
const _mime = (value, _failure = 0) => {
    //mime type item
    const item = {
        value,
        type: '',
        ext: '',
        error: '',
        toString(prop) {
            const key = prop && ['mime', 'ext', 'error']
                .includes(prop = (0, utils_1._str)(prop, true).toLowerCase()) ? prop + '' : 'type';
            return this[key];
        }
    };
    //parse value
    try {
        const errors = [];
        const val = (0, utils_1._str)(value, true);
        if (val) {
            let m = null;
            if (m = val.match(/(\.|^)([-_0-9a-zA-Z]+)$/i)) { //ext
                let ext = m[2].toLowerCase();
                if (ext === 'jpeg')
                    ext = 'jpg';
                if (exports.EXT_MIMES.hasOwnProperty(ext))
                    item.type = exports.EXT_MIMES[item.ext = ext];
                else
                    errors.push(`Mime file extension "${ext}" is not supported`);
            }
            else if (/^[-_a-z0-9]+\/[^\/]+$/i.test(val)) { //mime
                const found = Object.entries(exports.EXT_MIMES).find(v => v[1].startsWith(val.toLowerCase()) || val.toLowerCase().startsWith(v[1]));
                if (found) {
                    let [ext, type] = found;
                    if (ext === 'jpeg')
                        ext = 'jpg';
                    item.ext = ext;
                    item.type = type;
                }
                else
                    errors.push(`Mime type "${val}" is not supported`);
            }
            else
                errors.push(`Invalid mime type or file extension string value`);
        }
        else
            errors.push('Blank mime type or file extension string value');
        if (errors.length)
            throw new Error(item.error = errors.join('; ') + '.'); //error - set, throw
        return item; //result
    }
    catch (e) {
        new utils_1.FailError(e, _failure, { item }, 'MimeTypeError');
        return item; //result
    }
};
exports._mime = _mime;
//# sourceMappingURL=_mime.js.map