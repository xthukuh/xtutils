"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._debouced = void 0;
/**
 * Create debounced callback function
 *
 * @param handler  Throttled callback handler
 * @param delay  Callback delay milliseconds
 * @param maxWait  Maximum callback delay milliseconds
 * @param immediate  Execute callback before delay
 * @returns Throttled callback function
 */
const _debouced = (handler, delay = 200, maxWait = 0, immediate = false) => {
    delay = !isNaN(delay = parseFloat(delay)) && delay >= 0 ? delay : 200;
    maxWait = !isNaN(maxWait = parseFloat(maxWait)) && maxWait >= 0 && maxWait > delay ? maxWait : 0;
    immediate = !!immediate;
    let immediateTimer, callTimer, waitTimer, nextCall;
    const execute = (is_immediate) => {
        let next = nextCall;
        nextCall = undefined;
        if (waitTimer) {
            clearTimeout(waitTimer);
            waitTimer = undefined;
        }
        if (callTimer && !is_immediate) {
            clearTimeout(callTimer);
            callTimer = undefined;
        }
        if ((next === null || next === void 0 ? void 0 : next.length) && 'function' === typeof handler)
            handler.apply(...next);
        if (delay && immediate && !is_immediate) {
            immediateTimer = setTimeout(() => {
                clearTimeout(immediateTimer);
                immediateTimer = undefined;
            }, delay);
        }
    };
    const wrapper = function (...args) {
        nextCall = [this, args];
        if (!delay)
            return execute();
        const _next = (no_wait = 0) => {
            clearTimeout(callTimer);
            callTimer = setTimeout(() => execute(), delay);
            if (!no_wait && maxWait && !waitTimer)
                waitTimer = setTimeout(() => execute(), maxWait);
        };
        if (!(immediate && !immediateTimer && !callTimer))
            return _next();
        _next(1);
        execute(1);
    };
    Object.defineProperties(wrapper, {
        length: { value: handler.length },
        name: { value: `${handler.name || 'anonymous'}__debounced__${delay}` },
    });
    return wrapper;
};
exports._debouced = _debouced;
