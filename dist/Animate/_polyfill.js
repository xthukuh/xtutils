"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelAnimationFrame = exports.requestAnimationFrame = void 0;
/**
 * Export polyfill for `window.requestAnimationFrame` and `window.cancelAnimationFrame`.
 *
 * This polyfill provides compatibility for browsers that do not support `requestAnimationFrame`
 * and `cancelAnimationFrame` by default. It checks for vendor-prefixed implementations and
 * falls back to a timeout-based solution if necessary.
 *
 * @constant {[(callback: (time: number) => void) => number, (handle: number) => void]}
 */
_a = (() => {
    let _requestAnimationFrame = undefined;
    let _cancelAnimationFrame = undefined;
    if ('undefined' !== typeof window) {
        const vendors = ['ms', 'moz', 'webkit', 'o'];
        _requestAnimationFrame = window.requestAnimationFrame;
        _cancelAnimationFrame = window.cancelAnimationFrame;
        for (let i = 0; i < vendors.length && !_requestAnimationFrame; i++) {
            const vendor = vendors[i];
            _requestAnimationFrame = window[`${vendor}RequestAnimationFrame`];
            _cancelAnimationFrame = window[`${vendor}CancelAnimationFrame`] || window[`${vendor}CancelRequestAnimationFrame`];
        }
    }
    let requestAnimationFrame;
    if (_requestAnimationFrame)
        requestAnimationFrame = _requestAnimationFrame;
    else {
        let prev = 0;
        requestAnimationFrame = function (callback) {
            let curr = new Date().getTime(), timeout = Math.max(0, 16 - (curr - prev)), time = curr + timeout;
            let id = setTimeout(() => 'function' === typeof callback ? callback(time) : null, timeout);
            prev = time;
            return id;
        };
    }
    let cancelAnimationFrame;
    if (_cancelAnimationFrame)
        cancelAnimationFrame = _cancelAnimationFrame;
    else
        cancelAnimationFrame = function (handle) {
            clearTimeout(handle);
        };
    if ('undefined' !== typeof window) {
        if (!window.requestAnimationFrame)
            window.requestAnimationFrame = requestAnimationFrame;
        if (!window.cancelAnimationFrame)
            window.cancelAnimationFrame = cancelAnimationFrame;
    }
    return [requestAnimationFrame, cancelAnimationFrame];
})(), exports.requestAnimationFrame = _a[0], exports.cancelAnimationFrame = _a[1];
//# sourceMappingURL=_polyfill.js.map