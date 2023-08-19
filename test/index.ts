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
} from '../lib';

(async()=>{
	// _sayHello(); //dev tests

	Term.info('>> Test mime');
	Term.table(['image/png', 'xlsx', 'test.pdf', '', 'xxxx', '.tmp'].map(v => {
		const val = _mime(v);
		return {
			value: v,
			str: val.toString(),
			type: val.toString('type'),
			ext: val.toString('ext'),
			error: val.toString('error'),
		};
	}));

	Term.info('>> Test path >_ [path] [separator] [_strict] [_type] [_failure]');
	let tmp: any;
	let [a, b, v_input, v_separator, v_strict, v_type, v_failure] = process.argv;
	const input = _str(v_input, true);
	const separator = _str(v_separator, true) || undefined;
	const _strict = [0, 1].includes(tmp = _int(v_strict, 0)) ? !!tmp : false;
	const _type = _str(v_type, true) || undefined;
	const _failure = [0, 1, 2].includes(tmp = _int(v_failure, 0)) ? tmp : 0;
	console.log({a, b, input, separator, _strict, _type, _failure});
	Term.info('');
	Term.info('>> _filepath ...');
	const paths = [
		'C:\\a\\b',
		'C:\\a/.././b\\c/test.txt',
		'/a/.././b\\c/',
		'/a/.././b\\c/.',
		'./a/.././b/c/test.txt',
		'../a/.././b/c/test.txt',
		'../../.././a/./b/c/.env',
		'C:\\a\\b',
		'C:\\..',
		'C:\\',
		'C:',
		'c:\\../b',
		'c:\\../b/.././c/../../d/e\\./../f',
		'//../b/.././c/../../d/e\\./../f',
		'x://../b/.././c/../../d/e\\./../f',
		'/../b',
		'/..',
		'/../.',
		'/.',
		input,
	];
	Term.table(paths.map(path => {
		const val = _filepath(path, separator as any, _strict, _type, _failure);
		return {
			value: path,
			str: val + '',
			root: val.toString('root'),
			drive: val.toString('drive'),
			// path: val.toString('path'),
			file: val.toString('file'),
			dir: val.toString('dir'),
			basename: val.toString('basename'),
			name: val.toString('name'),
			ext: val.toString('ext'),
			error: val.toString('error'),
		};
	}));

	//fails
	try {
		_filepath(input, separator as any, _strict, _type, 2);
	}
	catch (e: any){
		Term.warn(`<< "${e}"`, {error_item: e.item});
	}
})()
.catch(error => {
	Term.error(`[E] ${error?.stack || error}`);
});