"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._animate = exports.ANIMATE_DEFAULT_DURATION = exports.ANIMATE_DEFAULT_EASING = void 0;
const utils_1 = require("../utils");
const easings_1 = require("./easings");
const _polyfill_1 = require("./_polyfill");
/**
 * The default easing function used in animations.
 *
 * @constant {TEasingFunction}
 */
exports.ANIMATE_DEFAULT_EASING = easings_1.Easings.easeLinear;
/**
 * The default duration for animations, in milliseconds.
 *
 * @constant {number}
 */
exports.ANIMATE_DEFAULT_DURATION = 1000;
/**
 * Animates an object based on the provided options.
 *
 * @param {IAnimateOptions} options - The options to configure the animation.
 * @param {boolean} [_debug=false] - Enables debug mode if true.
 * @returns {IAnimation} The animation control object.
 * @throws {Error} Throws an error if the update callback is not defined in options.
 */
function _animate(options, _debug = false) {
    let { update: _update, before: _before, after: _after, easing: _easing = exports.ANIMATE_DEFAULT_EASING, duration: _duration = 1000, delay: _delay, delayed: _delayed = false, from: _from, to: _to, timeout: _timeout, autoplay: _autoplay = false, } = Object(options);
    const self = this;
    const context = 'object' === typeof self && self ? self : null;
    const update = (0, utils_1._isFunc)(_update) ? _update : undefined;
    const before = (0, utils_1._isFunc)(_before) ? _before : undefined;
    const after = (0, utils_1._isFunc)(_after) ? _after : undefined;
    if (!update) {
        let err = 'The update callback is not defined in `_animate` options!';
        console.error(err, options);
        throw new Error(err);
    }
    const easing = (() => {
        if ('string' === typeof _easing && easings_1.Easings.hasOwnProperty(_easing))
            _easing = easings_1.Easings[_easing];
        return 'function' === typeof _easing ? _easing : exports.ANIMATE_DEFAULT_EASING;
    })();
    const duration = (0, utils_1._posInt)(_duration, 0) ?? exports.ANIMATE_DEFAULT_DURATION;
    const delay = (0, utils_1._posInt)(_delay, 0) ?? 0;
    const delayed = Boolean(_delayed);
    const autoplay = Boolean(_autoplay);
    const timeout = (0, utils_1._posInt)(_timeout, 0) ?? 0;
    const from = (0, utils_1._num)(_from, 0);
    const to = (0, utils_1._num)(_to, 0);
    const diff = to - from;
    let id = undefined;
    let start = undefined;
    let is_done = undefined;
    let is_paused = undefined;
    let prev = undefined;
    let t = undefined;
    let d = 0;
    let p = 0;
    let pt = 0;
    let et = 0;
    let elapsed = 0;
    let index = -1;
    let then = Date.now();
    //reset
    const reset = () => {
        if (t)
            clearTimeout(t);
        if (id)
            (0, _polyfill_1.cancelAnimationFrame)(id);
        id = t = start = is_done = is_paused = prev = undefined;
        d = p = et = pt = elapsed = 0;
        index = -1;
        then = new Date().getTime();
        if (_debug)
            console.debug('[_animate] reset.');
        return !is_done;
    };
    //frame
    const frame = (time) => {
        if (time === prev || is_done)
            return;
        prev = time;
        index += 1;
        let delta = !duration ? 0 : easing.call(context, time, 0, 1, duration);
        let pos = 0;
        if (diff) {
            pos = Math.min(delta * Math.abs(diff), Math.abs(diff));
            pos = from + (pos * (diff < 0 ? -1 : 1));
        }
        let res = update.call(context, { index, delta, pos, time });
        if (time >= duration)
            is_done = 1;
        else if (res === false)
            is_done = -1;
    };
    //finish
    const finish = (timestamp) => {
        if (t)
            clearTimeout(t);
        if (pt) {
            p += (timestamp - pt);
            pt = 0;
        }
        let pause_duration = p;
        let total_duration = Math.max(Date.now() - then, elapsed + et);
        let abort_method;
        let aborted = false;
        let complete = !aborted;
        if (is_done && is_done < 0) {
            aborted = true;
            switch (is_done) {
                case -1:
                    abort_method = 'update';
                    break;
                case -2:
                    abort_method = 'begin';
                    break;
                case -4:
                    abort_method = 'timeout';
                    break;
                default:
                    abort_method = 'abort';
                    break;
            }
        }
        if (after)
            after.call(context, { aborted, abort_method, complete, pause_duration, total_duration });
        id = undefined;
    };
    //begin
    const begin = (timestamp) => {
        if (timeout)
            t = setTimeout(() => (is_done = -4), timeout);
        if (before) {
            let res = before.call(context, { timestamp, options, then });
            if (res === false)
                is_done = -2;
        }
    };
    //step
    const step = (timestamp) => {
        if (start === undefined)
            begin(timestamp);
        if (!start)
            start = timestamp;
        elapsed = (timestamp - start) + et;
        if (is_done)
            return finish(timestamp);
        if (is_paused) {
            id = undefined;
            et = elapsed;
            pt = timestamp;
            start = 0;
            elapsed = 0;
            return;
        }
        else if (pt) {
            p += (timestamp - pt);
            pt = 0;
        }
        if (!d || (d - +elapsed.toFixed(2)) <= 0.1) {
            if (!(!elapsed && delayed))
                frame(Math.min(+elapsed.toFixed(1), d ? d : duration));
            d += delay;
        }
        if (!is_done && elapsed >= duration)
            is_done = 1;
        if (is_done)
            return finish(timestamp);
        else
            id = (0, _polyfill_1.requestAnimationFrame)(step);
    };
    //abort
    const abort = () => {
        if (is_done)
            return false;
        is_done = -3;
        return true;
    };
    //play
    const play = (restart = false) => {
        if (_debug)
            console.debug(`[_animate] ${is_paused ? 'resume' : 'play'}.`, { restart, is_paused, is_done, duration, from, to, diff, easing });
        if (restart)
            reset();
        if (is_done)
            return false;
        is_paused = undefined;
        if (id)
            (0, _polyfill_1.cancelAnimationFrame)(id);
        id = (0, _polyfill_1.requestAnimationFrame)(step);
        return true;
    };
    //pause
    const pause = (toggle = true) => {
        if (toggle === null)
            toggle = !is_paused;
        else
            toggle = Boolean(toggle);
        if (_debug)
            console.debug(`[_animate] ${toggle ? 'pause' : 'unpause'}.`, { toggle, is_paused, is_done });
        if (is_done)
            return false;
        if (toggle === is_paused)
            return is_paused;
        return toggle ? (is_paused = toggle) : play();
    };
    //resume
    const resume = () => is_paused ? pause(false) : false;
    //restart
    const restart = () => play(true);
    //autoplay
    if (autoplay)
        play();
    //result - animation
    return {
        get _debug() {
            return _debug;
        },
        get begun() {
            return start !== undefined;
        },
        get paused() {
            return Boolean(is_paused);
        },
        get done() {
            return Boolean(is_done);
        },
        play,
        pause,
        resume,
        restart,
        reset,
        abort,
    };
}
exports._animate = _animate;
//# sourceMappingURL=_animate.js.map