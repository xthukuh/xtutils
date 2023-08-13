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
} from '../lib';

(async()=>{
	// _sayHello(); //dev tests

	Term.debug(' * @example');
	let tmp: string;
	console.log(` * _uuid() => '%s' %d`, (tmp = _uuid()), tmp.length);
	console.log(` * _uuid() => '%s' %d`, (tmp = _uuid()), tmp.length);
	console.log(` * _uuid(20) => '%s' %d`, (tmp = _uuid(20)), tmp.length);
	console.log(` * _uuid(7, 'test_') => '%s' %d`, (tmp = _uuid(7, 'test_')), tmp.length);
	console.log(` * _uuid(7, 'test_{uuid}_example') => '%s' %d`, (tmp = _uuid(7, 'test_{uuid}_example')), tmp.length);
	console.log(` * _uuid(7, 'test_{uuid}_{uuid}_example') => '%s' %d`, (tmp = _uuid(7, 'test_{uuid}_{uuid}_example')), tmp.length);
})()
.catch(error => {
	Term.error(`[E] ${error?.stack || error}`);
});