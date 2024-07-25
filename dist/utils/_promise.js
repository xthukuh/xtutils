"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._pendingAbort = exports._pending = exports.PENDING_CACHE = exports.PendingAbortError = exports._resolve = exports._sleep = exports._asyncValues = exports._asyncQueue = exports._asyncAll = void 0;
const _number_1 = require("./_number");
const _objects_1 = require("./_objects");
const _string_1 = require("./_string");
/**
 * Parallel resolve list items `<T=any>[]`
 *
 * @example
 * await _asyncAll<number, number>([1, 2], async (num) => num * 2) //[{status:'resolved',index:0,value:2},{status:'resolved',index:1,value:4}]
 * await _asyncAll([() => Promise.resolve(1), 2], async (num) => num * 2) //[{status:'resolved',index:0,value:2},{status:'resolved',index:1,value:4}]
 * await _asyncAll([async () => Promise.resolve(2), 4]) //[{status:'resolved',index:0,value:2},{status:'resolved',index:1,value:4}]
 *
 * @param items - queue list _**(supports promise or callback values)**_
 * @param callback - resolve queue item callback ~ supports parameters:
 * - `item:T` ~ next queue item
 * - `index:number` ~ next queue item index
 * - `length:number` ~ queued items count
 * - _**callback result is added to the `IPromiseResult[]` with same `index`**_
 *
 * @param onProgress - queue on progress callback ~ supports parameters:
 * - `percent:number` ~ queue processed items percentage (`integer 0 - 100`)
 * - `total:number` ~ queued items count
 * - `complete:number` ~ queue resolved items count
 * - `failures:number` ~ queue rejected items count
 * - _**returns void**_
 *
 * @returns `Promise<IPromiseResult<TResult>[]>`
 */
const _asyncAll = async (items, callback, onProgress) => {
    return new Promise((resolve) => {
        //-- queue arguments
        const _callback = 'function' === typeof callback ? callback : undefined;
        const _onProgress = 'function' === typeof onProgress ? onProgress : undefined;
        //-- queue promise
        let complete = 0, failures = 0;
        const queue = (0, _objects_1._arrayList)(items).map((value, index) => ({ index, value }));
        const length = queue.length;
        const results = [];
        const _resolve = () => void setTimeout(() => resolve(results), 0);
        //-- queue size check
        if (!length) {
            if (_onProgress)
                _onProgress(100, length, complete, failures);
            return _resolve();
        }
        else if (_onProgress)
            _onProgress(0, length, complete, failures);
        //fn => helper > pending promise complete
        const _done = (failed = false) => {
            complete++;
            if (failed)
                failures++;
            //-- progress update (on different thread)
            if (_onProgress) {
                const percent = Math.min(Math.floor(complete / length * 100), 100);
                try {
                    _onProgress(percent, length, complete, failures);
                }
                catch (err) {
                    console.warn(`[IGNORED] _asyncAll > onProgress callback exception; ${(0, _string_1._errorText)(err)}`);
                }
            }
            //-- check finished
            if (complete >= length)
                _resolve();
        };
        //-- queue all pending promises
        queue.forEach((next) => {
            (async () => {
                let { value: item, index } = next;
                if ('function' === typeof item)
                    item = item();
                if (item instanceof Promise)
                    item = await item;
                return _callback ? _callback(item, index, length) : item;
            })()
                .then((value) => {
                results[next.index] = { status: 'resolved', index: next.index, value };
                return _done();
            })
                .catch((reason) => {
                results[next.index] = { status: 'rejected', index: next.index, reason };
                return _done(true);
            });
        });
    });
};
exports._asyncAll = _asyncAll;
/**
 * Parallel resolve list items `<T=any>[]` with max simultaneous promises size limit
 *
 * @param values - queue values
 * @param size - max simultaneous promises size (default: `0` ~ unlimited)
 * @param callback - queue resolve value callback ~ `(value:T,index:number,length:number)=>Promise<TResult=any>`
 * @param onProgress - queue on progress callback ~ `(percent:number,total:number,complete:number,failures:number)=>void`
 * @returns `Promise<IPromiseResult<TResult>[]>`
 */
const _asyncQueue = async (values, size = 0, callback, onProgress) => {
    return new Promise((resolve) => {
        //-- queue arguments
        size = (0, _number_1._posInt)(size) ?? 0;
        const _callback = 'function' === typeof callback ? callback : undefined;
        const _onProgress = 'function' === typeof onProgress ? onProgress : undefined;
        const queue = (0, _objects_1._arrayList)(values).map((value, index) => ({ index, value }));
        const length = queue.length;
        let pending = 0, complete = 0, failures = 0;
        //-- queue results
        const results = [];
        const _resolve = () => void setTimeout(() => resolve(results), 0);
        //-- queue size check
        if (!length) {
            if (_onProgress)
                _onProgress(100, length, complete, failures);
            return _resolve();
        }
        else if (_onProgress)
            _onProgress(0, length, complete, failures);
        //fn => helper > queue next timeout multiple calls throttle (50ms)
        let next_timeout = undefined;
        const _queue_next = () => {
            clearTimeout(next_timeout);
            next_timeout = setTimeout(() => _next(), next_timeout ? 50 : 0);
        };
        //>> queue next start
        _queue_next();
        //fn => helper > queue next
        function _next() {
            //-- pending limit > ignore ~ simultaneous size limit
            if (size && (pending + 1) > size)
                return;
            //-- next queue item > ignore ~ empty queue
            const next = queue.shift();
            if (!next)
                return;
            //-- pending increment
            pending++;
            //fn => helper > pending promise complete
            const _done = (failed = false) => {
                //-- decrement pending > increment complete/failures
                pending--;
                complete++;
                if (failed)
                    failures++;
                //-- progress update (on different thread)
                if (_onProgress) {
                    const percent = Math.min(Math.floor(complete / length * 100), 100);
                    try {
                        _onProgress(percent, length, complete, failures);
                    }
                    catch (err) {
                        console.warn(`[IGNORED] _asyncBatch > onProgress callback exception; ${(0, _string_1._errorText)(err)}`);
                    }
                }
                //<< queue complete/next
                if (complete >= length)
                    return _resolve();
                return _queue_next();
            };
            //-- pending promise
            (async () => _callback ? _callback(next.value, next.index, length) : next.value)()
                .then((result) => {
                results[next.index] = { status: 'resolved', index: next.index, value: result };
                _done();
            })
                .catch((reason) => {
                results[next.index] = { status: 'rejected', index: next.index, reason };
                _done(true);
            });
            //<< queue next (add)
            _queue_next();
        }
    });
};
exports._asyncQueue = _asyncQueue;
/**
 * Get async iterable values (i.e. `for await (const value of _asyncValues(array)){...}`)
 *
 * @param array  Values
 * @returns Async iterable object
 */
const _asyncValues = (array) => ({
    values: () => array,
    size: () => array.length,
    async each(callback) {
        let self = this, cancel = false, index = -1, _break = () => {
            cancel = true;
        };
        for await (const value of self) {
            index++;
            if (cancel)
                break;
            await callback(value, index, self.size(), _break);
        }
    },
    [Symbol.asyncIterator]() {
        let index = 0;
        const that = this;
        return {
            async next() {
                let value = undefined, length = that.size();
                if (index >= length)
                    return { done: true, value };
                value = await Promise.resolve(array[index]);
                index++;
                return { done: false, value };
            },
        };
    },
});
exports._asyncValues = _asyncValues;
/**
 * Delay promise
 *
 * @param timeout  Delay milliseconds
 * @returns `Promise<number>` timeout
 */
const _sleep = async (timeout) => {
    timeout = !isNaN(timeout) && timeout >= 0 ? timeout : 0;
    return new Promise(resolve => setTimeout(() => resolve(timeout), timeout));
};
exports._sleep = _sleep;
/**
 * Resolve promise callback/value
 *
 * @param this - call context
 * @param promise - resolve ~ `()=>Promise<any>|any` callback result | `any` value
 * @param _new - whether to return new promise
 * @returns `Promise<any>` ~ `Promise.resolve` value/result
 */
async function _resolve(promise, _new = false) {
    const resolved = Promise.resolve('function' !== typeof promise ? promise : (async () => promise.call(this))());
    return !_new ? resolved : new Promise((resolve, reject) => resolved.then(resolve, reject));
}
exports._resolve = _resolve;
;
/**
 * @class pending promise abort error
 */
class PendingAbortError extends Error {
    name = 'PendingAbortError';
    pending;
    constructor(message, pending) {
        super(message);
        this.pending = pending;
    }
}
exports.PendingAbortError = PendingAbortError;
/**
 * Pending promise task cache
 */
exports.PENDING_CACHE = {};
/**
 * Create/resume pending promise
 *
 * @param key - unique promise key/name/ID ~ `string` (i.e. `String(Date.now())`)
 * @param promise - promise instance creator callback ~ `()=>Promise<TResult>`
 * @param mode - new pending behavior when `key` duplicate exists:
 * - `0` = ignore (default) ~ resolve pending
 * - `1` = replace ~ replace pending promise
 * - `2` = retry ~ resolve next if pending promise rejection
 * - `3` = chain ~ resolve next after pending promise is done (resolves/rejects)
 * @param keep - whether to keep resolved promise in cache (default: `false`) ~ pending promises are automatically removed from cache by default or on rejection.
 * @returns `IPendingPromise` ~ `extends Promise<any>`
 */
const _pending = (key, promise, mode = 0, keep = false) => {
    if (!(key = (0, _string_1._str)(key, true)))
        throw new TypeError('Invalid pending `key` value.');
    if ('function' !== typeof promise)
        throw new TypeError('Invalid pending `promise` callback function.');
    let _pending_resolve = undefined;
    let _pending_reject = undefined;
    let pending = exports.PENDING_CACHE[key];
    const current = pending && pending.promise instanceof Promise && pending.resolved > -1 ? pending.promise : undefined;
    if (!current || mode) {
        const next_promise = (!current || mode === 1) ? _resolve(promise) : _resolve(current, true)
            .then(async (value) => mode === 2 ? value : _resolve(promise))
            .catch(async () => _resolve(promise));
        pending = exports.PENDING_CACHE[key] = {
            key,
            promise: next_promise,
            resolved: 0,
            keep,
            aborted: false,
            abortError: undefined,
            abort: function (reason) {
                const that = this;
                if (!('function' === typeof _pending_reject && !that.resolved && !that.aborted))
                    return;
                _pending_reject(that.abortError = new PendingAbortError((0, _string_1._str)(reason, true) || 'aborted', that), that.aborted = true);
            },
        };
    }
    else {
        pending.abortError = undefined;
        pending.aborted = false;
    }
    let resolved = 0;
    const pending_promise = new Promise((resolve, reject) => {
        _pending_resolve = (value) => {
            if (!resolved) {
                resolved = 1;
                resolve(value);
            }
            pending.resolved = 1;
            if (exports.PENDING_CACHE[key] === pending && !pending.keep)
                delete exports.PENDING_CACHE[key];
        };
        _pending_reject = (reason, abort = false) => {
            if (!resolved) {
                resolved = -1;
                reject(reason);
            }
            if (abort)
                return;
            pending.resolved = -1;
            if (exports.PENDING_CACHE[key] === pending)
                delete exports.PENDING_CACHE[key];
        };
        const _reject = (reason) => void ('function' === typeof _pending_reject ? _pending_reject(reason) : null);
        pending.promise.then(_pending_resolve, _reject);
    });
    pending_promise.pending = pending;
    return pending_promise;
};
exports._pending = _pending;
/**
 * Abort cached pending promises
 *
 * @param remove - whether to remove aborted promise from cache (default: `false`)
 * @param key - specify cached promise key to abort (default: `all` ~ when key is `undefined`/blank)
 * @param reason - specify abort reason (default: `'aborted'`)
 * @returns `void`
 */
const _pendingAbort = (remove = false, key, reason) => {
    if (key = (0, _string_1._str)(key, true)) {
        const pending = exports.PENDING_CACHE[key];
        if ('function' === typeof pending?.abort)
            pending.abort(reason);
        if (remove && pending?.key)
            delete exports.PENDING_CACHE[pending.key];
    }
    else {
        for (const pending of Object.values(exports.PENDING_CACHE)) {
            if ('function' === typeof pending?.abort)
                pending.abort(reason);
            if (remove && pending?.key)
                delete exports.PENDING_CACHE[pending.key];
        }
    }
};
exports._pendingAbort = _pendingAbort;
//# sourceMappingURL=_promise.js.map