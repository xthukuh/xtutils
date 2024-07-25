"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.easeInBack = exports.easeInOutElastic = exports.easeOutElastic = exports.easeInElastic = exports.easeInOutQuint = exports.easeOutQuint = exports.easeInQuint = exports.easeInOutQuart = exports.easeOutQuart = exports.easeInQuart = exports.easeInOutCubic = exports.easeOutCubic = exports.easeInCubic = exports.easeInOutCirc = exports.easeOutCirc = exports.easeInCirc = exports.easeInOutExpo = exports.easeOutExpo = exports.easeInExpo = exports.easeInOutSine = exports.easeOutSine = exports.easeInSine = exports.easeInOutQuad = exports.easeOutQuad = exports.easeInQuad = exports.easeLinear = void 0;
const easeLinear = (time, begin, change, duration) => change * time / duration + begin;
exports.easeLinear = easeLinear;
const easeInQuad = (time, begin, change, duration) => change * (time /= duration) * time + begin;
exports.easeInQuad = easeInQuad;
const easeOutQuad = (time, begin, change, duration) => -change * (time /= duration) * (time - 2) + begin;
exports.easeOutQuad = easeOutQuad;
const easeInOutQuad = (time, begin, change, duration) => {
    if ((time /= duration / 2) < 1)
        return change / 2 * time * time + begin;
    return -change / 2 * ((--time) * (time - 2) - 1) + begin;
};
exports.easeInOutQuad = easeInOutQuad;
const easeInSine = (time, begin, change, duration) => -change * Math.cos(time / duration * (Math.PI / 2)) + change + begin;
exports.easeInSine = easeInSine;
const easeOutSine = (time, begin, change, duration) => change * Math.sin(time / duration * (Math.PI / 2)) + begin;
exports.easeOutSine = easeOutSine;
const easeInOutSine = (time, begin, change, duration) => -change / 2 * (Math.cos(Math.PI * time / duration) - 1) + begin;
exports.easeInOutSine = easeInOutSine;
const easeInExpo = (time, begin, change, duration) => (time === 0) ? begin : change * Math.pow(2, 10 * (time / duration - 1)) + begin;
exports.easeInExpo = easeInExpo;
const easeOutExpo = (time, begin, change, duration) => (time === duration) ? begin + change : change * (-Math.pow(2, -10 * time / duration) + 1) + begin;
exports.easeOutExpo = easeOutExpo;
const easeInOutExpo = (time, begin, change, duration) => {
    if (time === 0)
        return begin;
    if (time === duration)
        return begin + change;
    if ((time /= duration / 2) < 1)
        return change / 2 * Math.pow(2, 10 * (time - 1)) + begin;
    return change / 2 * (-Math.pow(2, -10 * --time) + 2) + begin;
};
exports.easeInOutExpo = easeInOutExpo;
const easeInCirc = (time, begin, change, duration) => -change * (Math.sqrt(1 - (time /= duration) * time) - 1) + begin;
exports.easeInCirc = easeInCirc;
const easeOutCirc = (time, begin, change, duration) => change * Math.sqrt(1 - (time = time / duration - 1) * time) + begin;
exports.easeOutCirc = easeOutCirc;
const easeInOutCirc = (time, begin, change, duration) => {
    if ((time /= duration / 2) < 1)
        return -change / 2 * (Math.sqrt(1 - time * time) - 1) + begin;
    return change / 2 * (Math.sqrt(1 - (time -= 2) * time) + 1) + begin;
};
exports.easeInOutCirc = easeInOutCirc;
const easeInCubic = (time, begin, change, duration) => change * (time /= duration) * time * time + begin;
exports.easeInCubic = easeInCubic;
const easeOutCubic = (time, begin, change, duration) => change * ((time = time / duration - 1) * time * time + 1) + begin;
exports.easeOutCubic = easeOutCubic;
const easeInOutCubic = (time, begin, change, duration) => {
    if ((time /= duration / 2) < 1)
        return change / 2 * time * time * time + begin;
    return change / 2 * ((time -= 2) * time * time + 2) + begin;
};
exports.easeInOutCubic = easeInOutCubic;
const easeInQuart = (time, begin, change, duration) => change * (time /= duration) * time * time * time + begin;
exports.easeInQuart = easeInQuart;
const easeOutQuart = (time, begin, change, duration) => -change * ((time = time / duration - 1) * time * time * time - 1) + begin;
exports.easeOutQuart = easeOutQuart;
const easeInOutQuart = (time, begin, change, duration) => {
    if ((time /= duration / 2) < 1)
        return change / 2 * time * time * time * time + begin;
    return -change / 2 * ((time -= 2) * time * time * time - 2) + begin;
};
exports.easeInOutQuart = easeInOutQuart;
const easeInQuint = (time, begin, change, duration) => change * (time /= duration) * time * time * time * time + begin;
exports.easeInQuint = easeInQuint;
const easeOutQuint = (time, begin, change, duration) => change * ((time = time / duration - 1) * time * time * time * time + 1) + begin;
exports.easeOutQuint = easeOutQuint;
const easeInOutQuint = (time, begin, change, duration) => {
    if ((time /= duration / 2) < 1)
        return change / 2 * time * time * time * time * time + begin;
    return change / 2 * ((time -= 2) * time * time * time * time + 2) + begin;
};
exports.easeInOutQuint = easeInOutQuint;
const easeInElastic = (time, begin, change, duration) => {
    let s = 1.70158;
    let p = 0;
    let a = change;
    if (time === 0)
        return begin;
    if ((time /= duration) === 1)
        return begin + change;
    if (!p)
        p = duration * .3;
    if (a < Math.abs(change)) {
        a = change;
        s = p / 4;
    }
    else
        s = p / (2 * Math.PI) * Math.asin(change / a);
    return -(a * Math.pow(2, 10 * (time -= 1)) * Math.sin((time * duration - s) * (2 * Math.PI) / p)) + begin;
};
exports.easeInElastic = easeInElastic;
const easeOutElastic = (time, begin, change, duration) => {
    let s = 1.70158;
    let p = 0;
    let a = change;
    if (time === 0)
        return begin;
    if ((time /= duration) === 1)
        return begin + change;
    if (!p)
        p = duration * .3;
    if (a < Math.abs(change)) {
        a = change;
        s = p / 4;
    }
    else
        s = p / (2 * Math.PI) * Math.asin(change / a);
    return a * Math.pow(2, -10 * time) * Math.sin((time * duration - s) * (2 * Math.PI) / p) + change + begin;
};
exports.easeOutElastic = easeOutElastic;
const easeInOutElastic = (time, begin, change, duration) => {
    let s = 1.70158;
    let p = 0;
    let a = change;
    if (time === 0)
        return begin;
    if ((time /= duration / 2) === 2)
        return begin + change;
    if (!p)
        p = duration * (.3 * 1.5);
    if (a < Math.abs(change)) {
        a = change;
        s = p / 4;
    }
    else
        s = p / (2 * Math.PI) * Math.asin(change / a);
    if (time < 1)
        return -.5 * (a * Math.pow(2, 10 * (time -= 1)) * Math.sin((time * duration - s) * (2 * Math.PI) / p)) + begin;
    return a * Math.pow(2, -10 * (time -= 1)) * Math.sin((time * duration - s) * (2 * Math.PI) / p) * .5 + change + begin;
};
exports.easeInOutElastic = easeInOutElastic;
const easeInBack = (time, begin, change, duration) => {
    let s;
    if (s === undefined)
        s = 1.70158;
    return change * (time /= duration) * time * ((s + 1) * time - s) + begin;
};
exports.easeInBack = easeInBack;
//# sourceMappingURL=_easing_functions.js.map