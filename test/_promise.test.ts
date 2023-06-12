import { _sleep, _asyncAll, _asyncValues } from '../lib';

//_asyncAll
describe(
	`🚩 interface IPromiseResult<TResult> {status: 'resolved'|'rejected';index: number;value?: TResult|undefined;reason?: any;}`
	+ '\n\n  _asyncAll: async<T extends any, TResult extends any>(array: T[], callback?: (value: T, index: number, array: T[])'
	+ '\n  => Promise<TResult>) => Promise<IPromiseResult<TResult>[]>'
	, () => {

		//no rejection
		test(
			`no rejection : await _asyncAll<number, number>([1, 2], async (num) => String(num * 2))`
			+ `\n      --> [{status: 'resolved', index: 0, value: '2'}, {status: 'resolved', index: 1, value: '4'}]`
			, async () => {
			const results = await _asyncAll<number, string>([1, 2], async (num) => String(num * 2));
			expect(results).toEqual([{status: 'resolved', index: 0, value: '2'}, {status: 'resolved', index: 1, value: '4'}]);
		});

		//with rejection
		test(
			`with rejection : await _asyncAll<any, string>(['a', Promise.reject('b')], async (v) => v)`
			+ `\n      --> [{status: 'resolved', index: 0, value: 'a'}, {status: 'rejected', index: 1, reason: 'b'}]`
			, async () => {
			const results = await _asyncAll<any, string>(['a', Promise.reject('b')], async (v) => v);
			expect(results).toEqual([{status: 'resolved', index: 0, value: 'a'}, {status: 'rejected', index: 1, reason: 'b'}]);
		});
});

//_asyncValues
describe(
	'\n  _asyncValues: <T extends any>(array: T[]) => {'
	+ '\n    values: () => T[],'
	+ '\n    size: () => number;'
	+ '\n    each: (callback: (value: T, index: number, length: number, _break: ()=>void)=>Promise<any>) => Promise<void>;'
	+ '\n    [Symbol.asyncIterator]: () => {'
	+ '\n      next: () => Promise<{done: boolean; value?: T}>;'
	+ '\n    }'
	+ '\n  }'
	, () => {
		
		//.values()
		test('test method : `_asyncValues<number>([1,2]).values() ---> [1, 2]`', () => {
			expect(_asyncValues<number>([1, 2]).values()).toEqual([1, 2]);
		});

		//.size()
		test('test method : `_asyncValues<number>([1,2,3]).size() ---> 3`', () => {
			expect(_asyncValues<number>([1,2,3]).size()).toBe(3);
		});
		
		//for await
		test('test usage : `for await (const num of _asyncValues<number>([1,2])){...}`', async () => {
			const buffer: string[] = [];
			for await (const num of _asyncValues<number>([1, 2])){
				const val: string = await new Promise((resolve) => setTimeout(() => resolve(String(num)), 200));
				buffer.push(val);
			}
			expect(buffer).toEqual(['1', '2']);
		});

		//.each()
		test('test usage : `await _asyncValues<number>([1, 2]).each(async (num, i, len) => {...})`', async () => {
			const buffer: string[] = [];
			await _asyncValues<number>([1, 2]).each(async (num, i, len) => {
				const val: number = await new Promise((resolve) => setTimeout(() => resolve(num * 2), 200));
				buffer.push(`[${i + 1}/${len}] "${val}"`);
			});
			expect(buffer).toEqual(['[1/2] "2"', '[2/2] "4"']);
		});
});

//_sleep
describe(`\n  _sleep: async (timeout: number) => Promise<number>`, () => {

	//timeout
	test(`sleep timeout 1000 ms : await _sleep(1000) ---> 1000`, async () => {
		const start = new Date().getTime();
		const result = await _sleep(1000);
		const eta = new Date().getTime() - start;
		expect(result).toBe(1000);
		expect(eta).toBeGreaterThanOrEqual(1000);
	});

	//negative
	test(`sleep timeout -500 ms (negative == 0) : await _sleep(-500) ---> 0`, async () => {
		const start = new Date().getTime();
		const result = await _sleep(-500);
		const eta = new Date().getTime() - start;
		expect(result).toBe(0);
		expect(eta).toBeLessThanOrEqual(100);
	});
});