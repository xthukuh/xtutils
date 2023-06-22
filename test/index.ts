import {
	_sayHello,
	_deepClone,
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
	_shallowCompare,
} from '../lib';

(async()=>{
	_sayHello();

	// console.log('-- Test _shallowCompare');
	// const a = {name: 'Thuku', age: 30, val: undefined};
	// const b = {name: 'Thuku', age: 30, val: null};
	// const c = {name: 'Thuku', age: 30, val: undefined, phone: 555555};
	// console.log(`const a = {name: 'Thuku', age: 30, val: undefined};`);
	// console.log(`const b = {name: 'Thuku', age: 30, val: null};`);
	// console.log(`const c = {name: 'Thuku', age: 30, val: undefined, phone: 555555};`);
	// console.log('_shallowCompare(a, b)', _shallowCompare(a, b));
	// console.log('_shallowCompare(a, b, true)', _shallowCompare(a, b, true));
	// console.log('_shallowCompare(a, c)', _shallowCompare(a, c));
	// console.log('_shallowCompare(a, c, true)', _shallowCompare(a, c));

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
	
	// //_deepClone
	// console.log('');
	// console.log('--test _deepClone');
	// const language = {
	// 	set current(name: any){
	// 		this.log.push(name);
	// 	},
	// 	log: [] as any[],
	// };
	// language.current = 'EN';
	// language.current = {name: 'test', items: [1, {age: 30}, 3], date: new Date()}
	// const a = language;
	// const b = _deepClone(a, {});
	// b.current = 'BB';
	// console.log({a, b}, a === b);

	// let x: any = new Date(0);
	// x.extra = 'epoch';
	// let y: any = _deepClone(x);
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