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
	_posInt,
	_date,
	_posNum,
	_num,
	_jsonParse,
	_pending,
	PENDING_CACHE,
	_pendingAbort,
	IPendingPromise,
	PendingAbortError,
	_dotGet,
} from '../lib';

(async()=>{
	
	//test _doGet
	let t: any, p: string = '';
	const _failure = 1;
	// const _default = undefined;
	const _default = `_fail_${Date.now()}_`;
	const _null = _default;
	const _test = (...args: any[]):(()=>any) => () => _dotGet.apply(this, args as any);
	const items = [
		[t = {x:1}, p = 'x', _test(p, t, _failure, _default), 1],
		[t = {x:1}, p = 'y', _test(p, t, _failure, _default), _null],
		[t = {a:{b:{c:1}}}, p = 'a.b.c', _test(p, t, _failure, _default), 1],
		[t = {a:{b:{c:1}}}, p = 'a.b.d', _test(p, t, _failure, _default), _null],
		[t = {a:{b:{c:1,d:undefined}}}, p = 'a.b.d', _test(p, t, _failure, _default), undefined],
		[t = {a:['x','y']}, p = 'a.0', _test(p, t, _failure, _default), 'x'],

		//array reverse operation
		[t = [[1,2,3]], p = '0.!reverse', _test(p, t, _failure, _default), [3,2,1]],
		[t = [[1,2,3]], p = '0.!slice.!reverse', _test(p, t, _failure, _default), [3,2,1]],

		//array slice operation
		[t = [[1,2,3]], p = '0.!slice', _test(p, t, _failure, _default), [1,2,3]],

		//array slice negative `-number`
		[t = [[1,2,3]], p = '0.-2', _test(p, t, _failure, _default), [2,3]],
		[t = [[1,2,3]], p = '0.-2.!reverse', _test(p, t, _failure, _default), [3,2]],

		//array `key=value` searching
		[t = [[{a:1,b:2},{a:2,b:3}]], p = '0.a=2', _test(p, t, _failure, _default), {a:2,b:3}],
		[t = [[{a:1,b:2},{a:2,b:3}]], p = '0.b=2', _test(p, t, _failure, _default), {a:1,b:2}],
		[t = [[{a:1,b:2},{a:2,b:3}]], p = '0.c=4', _test(p, t, _failure, _default), _null],
		[t = [[{a:1,b:2,c:3}, {a:2,b:3,c:4}]], p = '0.a=1,b=2', _test(p, t, _failure, _default), {a:1,b:2,c:3}],
		[t = [[{a:1,b:2,c:3}, {a:2,b:3,c:4}]], p = '0.b=3,c=4', _test(p, t, _failure, _default), {a:2,b:3,c:4}],
	];
	const tests: any[] = [];
	items.forEach(arr => {
		const [_target, dot_path, cb, _expected] = arr;
		const _cb: ()=>any = cb as any;
		const target = JSON.stringify(_target);
		const _result = _cb();
		const after = JSON.stringify(_target);
		const result = JSON.stringify(_result);
		const expected = JSON.stringify(_expected);
		const pass = result === expected;
		const same = target === after;
		// const txt = ` * _dotGet('${dot_path}', ${target.replace(/"/g, `'`)}) => ${expected.replace(/"/g, `'`)}`;
		// if (pass) Term.success(txt);
		// else Term.warn(txt);
		tests.push({dot_path, target, after, result, expected, pass, same});
	});
	Term.table(tests);

})()
.catch((error: any) => {
	Term.error(`[E] ${error?.stack || error}`);
});