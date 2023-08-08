import {
	_sayHello,
	_cloneDeep,
	_jsonStringify,
	_animate,
	Easings,
	_hashCode,
	_hash53,
	_base64Encode,
	_base64Decode,
	_uuid,
	_round,
	_minMax,
	_compareShallow,
	_rand,
	_asyncAll,
	_sleep,
	_asyncValues,
	Term,
	Tasks,
} from '../lib';

(async()=>{
	// _sayHello();

	//TODO: test Tasks

	// console.log('-- Test ProgressTracker');
	// const prog_tracker = new ProgressTracker(p => {
	// 	Term.success(`-- tracker progress callback: ${p}%`);
	// });
	// const arr: number[] = [...Array(5)].map(_ => _rand(1000, 3000));
	// arr.forEach((val, i) => {
	// 	const name = `test-${i}`;
	// 	// prog_tracker.add(name, val, p => {
	// 	// 	Term.info(`-- [${name}] item progress callback: ${p}%`);
	// 	// });
	// 	prog_tracker.add(name, val);
	// });
	// await _asyncAll(arr, async (val, i, len) => {
	// 	const name = `test-${i}`;
	// 	Term.debug(`[${i}/${len}] test item:`, {name, val});
	// 	const values = [], inc = 500;
	// 	let sum = 0;
	// 	while (1){
	// 		sum += inc;
	// 		values.push(inc);
	// 		if (sum > val) break;
	// 	}
	// 	sum = 0;
	// 	await _asyncValues(values).each(async (v, x) => {
	// 		sum += v;
	// 		await _sleep(_rand(500, 1500));
	// 		if (i === 2 && x === 1){
	// 			const res = prog_tracker.complete(name);
	// 			Term.warn(`--- prog_tracker.complete(${name})`, res);
	// 		}
	// 		const res = prog_tracker.update(name, sum);
	// 		// Term.debug(`--- prog_tracker.update(${name}, ${sum}):`, res);
	// 	});
	// });
	// setTimeout(() => {
	// 	Term.log(`--- prog_tracker.progress()`, prog_tracker.progress());
	// 	Term.log(`--- prog_tracker.done()`, prog_tracker.done());
	// });

	// console.log('-- Test _compareShallow');
	// const a = {name: 'Thuku', age: 30, val: undefined};
	// const b = {name: 'Thuku', age: 30, val: null};
	// const c = {name: 'Thuku', age: 30, val: undefined, phone: 555555};
	// console.log(`const a = {name: 'Thuku', age: 30, val: undefined};`);
	// console.log(`const b = {name: 'Thuku', age: 30, val: null};`);
	// console.log(`const c = {name: 'Thuku', age: 30, val: undefined, phone: 555555};`);
	// console.log('_compareShallow(a, b)', _compareShallow(a, b));
	// console.log('_compareShallow(a, b, true)', _compareShallow(a, b, true));
	// console.log('_compareShallow(a, c)', _compareShallow(a, c));
	// console.log('_compareShallow(a, c, true)', _compareShallow(a, c));

	// console.log('-- Test _minMax');
	// console.log(`_minMax(20, 10) = `, _minMax(20, 10));
	// console.log(`_minMax(0.23, null) = `, _minMax(0.23, null));

	// console.log('-- Test _base64Encode');
	// [
	// 	'Hello world! This is a test.',
	// 	'Hello world!',
	// ].forEach((v: any) => {
	// 	let res = _base64Encode(v);
	// 	console.log(`>> value: "${v}"`);
	// 	console.log(`<< result: "${res}"`);
	// });
	// console.log('');
	// console.log('-- Test _base64Decode');
	// [
	// 	'SGVsbG8gd29ybGQhIFRoaXMgaXMgYSB0ZXN0Lg==',
	// 	'SGVsbG8gd29ybGQh',
	// ].forEach((v: any) => {
	// 	let res: any = _base64Decode(v);
	// 	console.log(`>> value: "${v}"`);
	// 	console.log(`<< result: "${res}"`, res);
	// });

	// console.log('-- Test _hashCode');
	// const tests = [
	// 	'Hello world!',
	// 	'hello world!',
	// 	'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque feugiat nisl lectus, sed malesuada dui consequat non. Aliquam viverra at augue vel dapibus. Nulla convallis orci a leo lacinia feugiat. Pellentesque lacinia justo ipsum. Donec orci magna, auctor in condimentum ac, auctor sit amet purus.',
	// ];
	// tests.forEach(v => {
	// 	let hash = _hashCode(v);
	// 	let len = String(hash).length;
	// 	console.log(`>> value: "${v}"`);
	// 	console.log(`<< hash: ${hash} (${len})`);
	// });
	// tests.forEach(v => {
	// 	let hash = _hashCode(v);
	// 	let len = String(hash).length;
	// 	console.log(`>> value: "${v}"`);
	// 	console.log(`<< hash: ${hash} (${len})`);
	// });
	// console.log('');
	// console.log('-- Test _hash53');
	// tests.forEach(v => {
	// 	let hash = _hash53(v, 0);
	// 	let len = String(hash).length;
	// 	console.log(`>> value: "${v}"`);
	// 	console.log(`<< hash: ${hash} (${len})`);
	// });
	// tests.forEach(v => {
	// 	let hash = _hash53(v, 0);
	// 	let len = String(hash).length;
	// 	console.log(`>> value: "${v}"`);
	// 	console.log(`<< hash: ${hash} (${len})`);
	// });
	
	// //_cloneDeep
	// console.log('');
	// console.log('--test _cloneDeep');
	// const language = {
	// 	set current(name: any){
	// 		this.log.push(name);
	// 	},
	// 	log: [] as any[],
	// };
	// language.current = 'EN';
	// language.current = {name: 'test', items: [1, {age: 30}, 3], date: new Date()}
	// const a = language;
	// const b = _cloneDeep(a, {});
	// b.current = 'BB';
	// console.log({a, b}, a === b);

	// let x: any = new Date(0);
	// x.extra = 'epoch';
	// let y: any = _cloneDeep(x);
	// x.extra = 'changed';
	// console.log({x, y}, x === y);

	// //animate
	// console.log('');
	// console.log('--test _animate');
	// _animate({
	// 	update: val => console.log('--- update', val),
	// 	duration: 1000,
	// 	from: 100,
	// 	to: 120,
	// 	easing: Easings.easeInOutQuad,
	// });
})();