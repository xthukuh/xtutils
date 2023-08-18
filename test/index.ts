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
	_normPath,
	_split,
	_int,
} from '../lib';

(async()=>{
	// _sayHello(); //dev tests

	Term.info('>> Test path >_ [path] [separator] [type] [failure]');
	let tmp: any;
	const input = process.argv[2] || 'example.png';
	const separator = _str(process.argv[3], true) || undefined;
	const _type = _str(process.argv[4], true) || undefined;
	const _failure = [0, 1, 2].includes(tmp = _int(process.argv[5], 0)) ? tmp : 0;
	console.log({input, separator, _type, _failure});
	Term.info('');
	Term.info('>> _normPath ...');
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
		'/../b',
		'/..',
		'/../.',
		'/.',
		input,
	];
	Term.table(paths.map(path => {
		const val = _normPath(path, separator as any, _type, _failure);
		console.log({val});
		return [path, val];
	}));

	//..
})()
.catch(error => {
	Term.error(`[E] ${error?.stack || error}`);
});