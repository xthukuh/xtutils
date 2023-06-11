"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._asyncValues = exports._asyncAll = exports._sleep = void 0;
/**
 * Delay promise
 *
 * @param timeout  Delay milliseconds
 * @returns `Promise`
 */
const _sleep = (timeout) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise(resolve => setTimeout(() => resolve(), timeout >= 0 ? timeout : 0));
});
exports._sleep = _sleep;
/**
 * Parallel resolve `array` values callback promises
 *
 * @param array  Entries
 * @param callback  Entry callback
 * @param results  [default: `false`] Return results buffer
 * @returns `Promise<void|IPromiseResult<TResult>[]>`
 */
const _asyncAll = (array, callback, results = false) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve) => {
        const _buffer = [], _len = array.length;
        const _resolve = () => resolve(results ? _buffer : undefined);
        if (!_len)
            return _resolve();
        let count = 0;
        array.forEach((v, i, a) => {
            (() => __awaiter(void 0, void 0, void 0, function* () { return Promise.resolve(callback ? callback(v, i, a) : v); }))()
                .then(value => results ? _buffer.push({ status: 'resolved', index: i, value }) : undefined)
                .catch(reason => results ? _buffer.push({ status: 'rejected', index: i, reason }) : undefined)
                .finally(() => ++count === _len ? _resolve() : undefined);
        });
    });
});
exports._asyncAll = _asyncAll;
/**
 * Get async iterable values (i.e. `for await (const value of _asyncValues(array)){...}`)
 *
 * @param array  Values
 * @returns Async iterable object
 */
const _asyncValues = (array) => ({
    values: () => array,
    size: () => array.length,
    each(callback) {
        var _a, e_1, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            let self = this, cancel = false, index = -1, _break = () => {
                cancel = true;
            };
            try {
                for (var _d = true, self_1 = __asyncValues(self), self_1_1; self_1_1 = yield self_1.next(), _a = self_1_1.done, !_a; _d = true) {
                    _c = self_1_1.value;
                    _d = false;
                    const value = _c;
                    index++;
                    if (!value)
                        continue;
                    if (cancel)
                        break;
                    yield callback(value, index, self.size(), _break);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = self_1.return)) yield _b.call(self_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        });
    },
    [Symbol.asyncIterator]() {
        let index = 0;
        const that = this;
        return {
            next() {
                return __awaiter(this, void 0, void 0, function* () {
                    const length = that.size();
                    if (index >= length)
                        return { done: true };
                    const value = yield Promise.resolve(array[index]);
                    index++;
                    return { done: false, value };
                });
            },
        };
    },
});
exports._asyncValues = _asyncValues;
