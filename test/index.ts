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
	Task,
	_str,
	_parseCsv,
	_toCsv,
	_filepath,
	_split,
	_int,
	_mime,
	EXT_MIMES,
	_basename,
	IMimeType,
	_parseDataUri,
	_values,
	_empty,
} from '../lib';

enum EnumType {
	string = 'string',
	int = 'int',
}


(async()=>{
	// _sayHello(); //dev tests

	const iterable1: any = {};
	iterable1[Symbol.iterator] = function* (){
		yield 1;
		yield 2;
		yield 3;
	};
	const task = new Task('Task_A');
	class TestClassEmpty {}
	class TestClassProps {
		name: any = 'TestClass';
		value: any = Date.now();
	}
	class TestClassMethod {
		test(){}
	}
	const test_class_empty = new TestClassEmpty();
	const test_class_props = new TestClassProps();
	const test_class_method = new TestClassMethod();
	const testObj = {
		toString(){
			return 'Hello!';
		}
	};
	const toPrimitive: any = {
		[Symbol.toPrimitive](hint: any){
			if (hint === "number") {
				return 10;
			}
		}
	};
	const tests = {
		_map: new Map<any, any>([['a', 1], ['b', 2], ['c', 3], [4, 'd']]),
		_set: new Set<any>([1, 1, 2, 3, 3, 4, 2, 5, 4]),
		_filled_object: {name: 'John', age: 20, phone: 555666, paid: false},
		_empty_object: {},
		_array: [5,4,3,2,1],
		_date: new Date(2023, 0, 1, 23, 58, 34),
		_error: new Error('Test error message.'),
		_undefined: undefined,
		_null: null,
		_float: 10.456,
		_integer: 45,
		_true: true,
		_false: false,
		_string: 'Hello world!',
		_iterable: iterable1,
		_object_task: task,
		_object_test_class_empty: test_class_empty,
		_object_test_class_props: test_class_props,
		_object_test_class_method: test_class_method,
		_object_toString: toString,
		_object_toPrimitive: toPrimitive,
	};
	Object.entries(tests).forEach(v => {
		console.log('');
		console.log('');
		console.log('---------------------------------------------------------------------');
		Term.info('v = ' + v[0]);
		const item: any = v[1];
		const json = _jsonStringify(item);
		const empty = _empty(item);
		const values = _values(item);
		const entries = _values(item, true);
		const values_object = _values(item, false, true);
		const entries_object = _values(item, true, true);
		console.log({
			item,
			json,
			empty,
			values,
			entries,
			values_object,
			entries_object,
		});
	});

	// Term.debug('--uuid = ' + _uuid(16, 'orders_'));
	// return;
	
	// const _input = _str(process.argv[2], true);
	// Term.debug(`-- input = "${_input}"`);

	// //parse uri
	// const data_uri = _parseDataUri(_input);
	// Term.log({data_uri});
	// return
	
	// const _input = _str(process.argv[2], true);
	// Term.debug(`-- input = "${_input}"`);
	// const _get_path = (v: any) => {
	// 	let tmp: IMimeType;
	// 	const bn = _basename(v, false, true);
	// 	return !bn.basename ? '' : (bn.ext && (tmp = _mime(bn.ext)).toString() ? bn.name + '.' + tmp.ext : bn.basename.replace(/__c$/i, '') + '.png');
	// };
	
	// const path = _get_path(_input);
	// Term.debug(`-- path = "${path}"`);

	// const mime = _mime(path).toString();
	// Term.debug(`-- mime = "${mime}"`);
	
	// const title = path.replace(/(.+)\.[a-z]+$/i, '$1').trim().replace(/[^a-z0-9]/ig, ' ').replace(/[ ]+/g, ' ').trim();
	// Term.debug(`-- title = "${title}"`);
	
	// const res = path.replace(/([\w]+)(\.[a-z]+)$/i, '$1-' + _uuid(7) + '$2');
	// Term.debug(`-- res = "${res}"`);
	// return;

	// Term.info('>> Test mime');
	// Term.table(['image/png', 'xlsx', 'test.pdf', '', 'xxxx', '.tmp'].map(v => {
	// 	const val = _mime(v);
	// 	return {
	// 		value: v,
	// 		str: val.toString(),
	// 		type: val.toString('type'),
	// 		ext: val.toString('ext'),
	// 		error: val.toString('error'),
	// 	};
	// }));

	// Term.info('>> Test path >_ [path] [separator] [_strict] [_type] [_failure]');
	// let tmp: any;
	// let [a, b, v_input, v_separator, v_strict, v_type, v_failure] = process.argv;
	// const input = _str(v_input, true);
	// const separator = _str(v_separator, true) || undefined;
	// const _strict = [0, 1].includes(tmp = _int(v_strict, 0)) ? !!tmp : false;
	// const _type = _str(v_type, true) || undefined;
	// const _failure = [0, 1, 2].includes(tmp = _int(v_failure, 0)) ? tmp : 0;
	// console.log({a, b, input, separator, _strict, _type, _failure});
	// Term.info('');
	// Term.info('>> _filepath ...');
	// const paths = [
	// 	'C:\\a\\b',
	// 	'C:\\a/.././b\\c/test.txt',
	// 	'/a/.././b\\c/',
	// 	'/a/.././b\\c/.',
	// 	'./a/.././b/c/test.txt',
	// 	'../a/.././b/c/test.txt',
	// 	'../../.././a/./b/c/.env',
	// 	'C:\\a\\b',
	// 	'C:\\..',
	// 	'C:\\',
	// 	'C:',
	// 	'c:\\../b',
	// 	'c:\\../b/.././c/../../d/e\\./../f',
	// 	'//../b/.././c/../../d/e\\./../f',
	// 	'x://../b/.././c/../../d/e\\./../f',
	// 	'/../b',
	// 	'/..',
	// 	'/../.',
	// 	'/.',
	// 	input,
	// ];
	// Term.table(paths.map(path => {
	// 	const val = _filepath(path, separator as any, _strict, _type, _failure);
	// 	return {
	// 		value: path,
	// 		str: val + '',
	// 		root: val.toString('root'),
	// 		drive: val.toString('drive'),
	// 		// path: val.toString('path'),
	// 		file: val.toString('file'),
	// 		dir: val.toString('dir'),
	// 		basename: val.toString('basename'),
	// 		name: val.toString('name'),
	// 		ext: val.toString('ext'),
	// 		error: val.toString('error'),
	// 	};
	// }));

	// //fails
	// try {
	// 	_filepath(input, separator as any, _strict, _type, 2);
	// }
	// catch (e: any){
	// 	Term.warn(`<< "${e}"`, {error_item: e.item});
	// }
})()
.catch(error => {
	Term.error(`[E] ${error?.stack || error}`);
});