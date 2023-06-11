/**
 * Delay promise
 *
 * @param timeout  Delay milliseconds
 * @returns `Promise`
 */
export declare const _sleep: (timeout: number) => Promise<void>;
/**
 * Promise result interface
 */
export interface IPromiseResult<TResult> {
    status: 'resolved' | 'rejected';
    index: number;
    value?: TResult | undefined;
    reason?: any;
}
/**
 * Parallel resolve `array` values callback promises
 *
 * @param array  Entries
 * @param callback  Entry callback
 * @param results  [default: `false`] Return results buffer
 * @returns `Promise<void|IPromiseResult<TResult>[]>`
 */
export declare const _asyncAll: <T extends unknown, TResult extends unknown>(array: T[], callback?: ((value: T, index: number, array: T[]) => Promise<TResult | undefined>) | undefined, results?: boolean) => Promise<void | IPromiseResult<TResult>[]>;
/**
 * Get async iterable values (i.e. `for await (const value of _asyncValues(array)){...}`)
 *
 * @param array  Values
 * @returns Async iterable object
 */
export declare const _asyncValues: <T extends unknown>(array: T[]) => {
    values: () => T[];
    size: () => number;
    each: (callback: (value: T, index: number, length: number, _break: () => void) => Promise<any>) => Promise<void>;
    [Symbol.asyncIterator]: () => {
        next: () => Promise<{
            done: boolean;
            value?: T | undefined;
        }>;
    };
};
