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
} from '../lib';

(async()=>{
	// _sayHello(); //dev tests

	Term.info('>> Test path');
	const input = process.argv[2] || 'example.png';
	return splitPath(input);
	const paths = [
		'C:\\a\\b',
		'C:\\a/.././b\\c/test.txt',
		'/a/.././b\\c/',
		'./a/.././b/c/test.txt',
		'../a/.././b/c/test.txt',
		'../../.././a/./b/c/.env',
		'C:\\a\\b',
		'C:\\..',
		'C:\\',
		'c:\\../b',
		'c:\\../b/.././c/../../d/e\\./../f',
		'//../b/.././c/../../d/e\\./../f',
		'/../b',
		'/..',
		'/../.',
		'/.',
		input,
	];
	console.log(Object.fromEntries(paths.map(path => {
		return [path, _normPath(path, '/')];
	})));
})()
.catch(error => {
	Term.error(`[E] ${error?.stack || error}`);
});

function splitPath(value: any): any {
	console.log('-- _split', _split(value, /[\\\/]/));
	const path = _normPath(value, '/', 'path', 1);
	const parts = path.split(/[\\\/]/g);
	console.log({path, parts});
	console.log(path.match(/(.*?(?=[^\\\/\:\?\"\<\>\|\*]+))/));
	Term.debug(Object.fromEntries(Object.entries(path.match(/([^\\\/\:\?\"\<\>\|\*]+)?(\.([-_0-9a-z]+))$/i) || []).map(v => [v[0] + '', v[1]])));
	Term.debug(Object.fromEntries(Object.entries(path.match(/[\\\/]([^\\\/\:\?\"\<\>\|\*]+)$/i) || []).map(v => [v[0] + '', v[1]])));
	Term.debug(Object.fromEntries(Object.entries(path.match(/^([^\\\/\:\?\"\<\>\|\*]+)$/i) || []).map(v => [v[0] + '', v[1]])));
}