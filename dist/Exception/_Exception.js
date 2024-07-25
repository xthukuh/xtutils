"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Exception = void 0;
/**
 * `Symbol` private props key name
 */
const PROPS = Symbol(`__private_props_${Date.now()}__`);
/**
 * `Exception` extends `Error` ~ like `DOMException`
 *
 * - message: `string`
 * - name: `string`
 * - code: `number`
 * - toString: `()=>string`
 */
class Exception extends Error {
    /**
     * Private props
     */
    [PROPS] = {};
    /**
     * Error message (default: `'Unspecified exception message.'`)
     */
    get message() {
        return this[PROPS].message;
    }
    /**
     * Error name (default: `'Exception'`)
     */
    get name() {
        return this[PROPS].name;
    }
    /**
     * Error code - `string` | finite/parsed `integer` (default: `0`)
     */
    get code() {
        return this[PROPS].code;
    }
    /**
     * Error data
     */
    get data() {
        return this[PROPS].data;
    }
    /**
     * Error data
     */
    get time() {
        return this[PROPS].time;
    }
    /**
     * New `IExceptionError` instance
     *
     * @param message - error message (default: `'Unspecified exception message.'`)
     * @param name - error name (default: `'Exception'`)
     * @param code - error code - `string` | finite/parsed `integer` (default: `0`)
     * @param data - error data
     * @param time - error timestamp milliseconds (default: `Date.now()`)
     * @returns `IExceptionError`
     */
    constructor(message, name, code, data, time) {
        const _time = Date.now();
        super(message = message && 'string' === typeof message && (message = message.trim()) ? message : 'Unspecified exception message.');
        if ('string' === typeof code)
            code = (code = code.trim()) ? code : 0;
        else if (!('number' === typeof code && !isNaN(code = parseInt(`${code}`)) && Number.isInteger(code) && Number.isFinite(code)))
            code = 0;
        this[PROPS] = {
            message,
            name: name && 'string' === typeof name && (name = name.trim()) ? name : 'Exception',
            code,
            data,
            time: time && !isNaN(time = parseInt(time)) && Number.isInteger(time) && Number.isFinite(time) && time >= 0 ? time : _time,
        };
    }
    /**
     * Get error `string`
     */
    toString() {
        const { message, name, code } = this;
        let text = name + ':';
        if (code !== 0)
            text += ' [' + code + ']';
        text += ' ' + message;
        return text;
    }
    /**
     * Create new `Exception`
     *
     * @param message - error message (default: `'Unspecified exception message.'`)
     * @param name - error name (default: `'Exception'`)
     * @param code - error code - `string` | finite/parsed `integer` (default: `0`)
     * @param data - error data
     * @param time - error timestamp milliseconds (default: `Date.now()`)
     * @returns `IExceptionError`
     */
    static error(message, name, code, data, time) {
        return new Exception(message, name, code, data, time);
    }
    /**
     * Create new `Exception` from parsed error
     *
     * @param error - parse error value (i.e. `string` message or Error/object/values {message: `string`, name: `string|undefined`, code: `string|number|undefined`, data: `any`, time: `number` ?? `Date.now()`})
     * @returns `IExceptionError`
     */
    static parse(error) {
        const time = Date.now();
        const _error = {};
        const _get_str = (val) => 'string' === typeof val && (val = val.trim()) ? val : undefined;
        const _get_int = (val) => !isNaN(val = parseInt(val)) && Number.isInteger(val) && Number.isFinite(val) && val >= 0 ? val : undefined;
        const _get_code = (val) => {
            let tmp = undefined;
            if ((tmp = _get_int(val)) !== undefined)
                return tmp;
            if ((tmp = _get_str(val)) !== undefined)
                return tmp;
            return tmp;
        };
        if (error && 'object' === typeof error) {
            let parsed = false;
            if (Array.isArray(error)) {
                const it = error[Symbol.iterator];
                if (['values', 'entries'].includes(it?.name) || 'function' === typeof it)
                    error = [...error];
                if (error.length) {
                    _error.message = _get_str(error[0]);
                    _error.name = _get_str(error[1]);
                    _error.code = _get_code(error[2]);
                    _error.data = error[3];
                    _error.time = _get_int(error[4]);
                    parsed = true;
                }
            }
            if (!parsed && error instanceof Error) {
                const err = error;
                _error.message = _get_str(err.message);
                _error.name = _get_str(err.name);
                _error.code = _get_code(err.code);
                _error.data = err.data;
                _error.time = _get_int(err.time);
                parsed = true;
            }
            if (!parsed) {
                _error.message = _get_str(error.message);
                _error.name = _get_str(error.name);
                _error.code = _get_code(error.code);
                _error.data = error.data;
                _error.time = _get_int(error.time);
                parsed = true;
            }
        }
        else
            _error.message = _get_str(error);
        return new Exception(_error.message ?? 'Unknown exception error.', _error.name ?? 'Error', _error.code, _error.data, _error.time ?? time);
    }
}
exports.Exception = Exception;
//# sourceMappingURL=_Exception.js.map