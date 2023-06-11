import { _str } from './_string';

/**
 * Delay promise
 * 
 * @param timeout  Delay milliseconds
 * @returns `Promise`
 */
export const _sleep = async (timeout: number): Promise<void> => {
	return new Promise(resolve => setTimeout(() => resolve(), timeout >= 0 ? timeout : 0));
};

/**
 * Promise result interface
 */
export interface IPromiseResult<TResult> {
	status: 'resolved'|'rejected';
	index: number;
	value?: TResult|undefined;
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
export const _asyncAll = async<T extends any, TResult extends any>(array: T[], callback?: (value: T, index: number, array: T[]) => Promise<TResult|undefined>, results: boolean = false): Promise<void|IPromiseResult<TResult>[]> => {
	return new Promise((resolve: (value?:IPromiseResult<TResult>[])=>void|IPromiseResult<TResult>[]) => {
		const _buffer: IPromiseResult<TResult>[] = [], _len = array.length;
		const _resolve = () => resolve(results ? _buffer : undefined);
		if (!_len) return _resolve();
		let count = 0;
		array.forEach((v, i, a) => {
			(async()=>Promise.resolve(callback ? callback(v, i, a) : v) as Promise<TResult>)()
			.then(value => results ? _buffer.push({status: 'resolved', index: i, value}) : undefined)
			.catch(reason => results ? _buffer.push({status: 'rejected', index: i, reason}) : undefined)
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