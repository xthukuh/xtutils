import { _str } from './_string';

/**
 * Promise result interface
 */
export interface IPromiseResult<TResult> {
	status: 'resolved'|'rejected';
	index: number;
	value?: TResult;
	reason?: any;
}

/**
 * Parallel resolve `array` values callback promises
 * - i.e. await _asyncAll<number, number>([1, 2], async (num) => num * 2) --> [{status: 'resolved', index: 0, value: 2}, {status: 'resolved', index: 1, value: 4}]
 * 
 * @param array  Entries
 * @param callback  Entry callback
 * @returns `Promise<IPromiseResult<TResult>[]>`
 */
export const _asyncAll = async<T extends any, TResult extends any>(array: T[], callback?: (value: T, index: number, array: T[]) => Promise<TResult>): Promise<IPromiseResult<TResult>[]> => {
	return new Promise((resolve) => {
		const _buffer: IPromiseResult<TResult>[] = [], _len = array.length;
		const _resolve = () => resolve(_buffer);
		if (!_len) return _resolve();
		let count = 0;
		array.forEach((v, i, a) => {
			(async()=>Promise.resolve(callback ? callback(v, i, a) : v) as Promise<TResult>)()
			.then(value => _buffer.push({status: 'resolved', index: i, value}))
			.catch(reason => _buffer.push({status: 'rejected', index: i, reason}))
			.finally(() => ++count === _len ? _resolve() : undefined);
		});
	});
};

/**
 * Get async iterable values (i.e. `for await (const value of _asyncValues(array)){...}`)
 * 
 * @param array  Values
 * @returns Async iterable object
 */
export const _asyncValues = <T extends any>(array: T[]): {
	values: () => T[],
	size: () => number;
	each: (callback: (value: T, index: number, length: number, _break: ()=>void)=>Promise<any>) => Promise<void>;
	[Symbol.asyncIterator]: () => {
		next: () => Promise<{done: boolean; value?: T}>;
	}
} => ({
	values: () => array,
	size: () => array.length,
	async each(callback: (value: T, index: number, length: number, _break: ()=>void)=>Promise<any>): Promise<void> {
		let self = this, cancel = false, index = -1, _break = () => {
			cancel = true;
		};
		for await (const value of self){
			index ++;
			if (!value) continue;
			if (cancel) break;
			await callback(value, index, self.size(), _break);
		}
	},
	[Symbol.asyncIterator](){
		let index = 0;
		const that = this;
		return {
			async next(): Promise<{done: boolean; value?: T}> {
				const length = that.size();
				if (index >= length) return {done: true};
				const value = await Promise.resolve(array[index]);
				index ++;
				return {done: false, value};
			},
		};
	},
});

/**
 * Delay promise
 * 
 * @param timeout  Delay milliseconds
 * @returns `Promise<number>` timeout
 */
export const _sleep = async (timeout: number): Promise<number> => {
	timeout = !isNaN(timeout) && timeout >= 0 ? timeout : 0
	return new Promise(resolve => setTimeout(() => resolve(timeout), timeout));
};