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
	_dotFlat,
	_dotInflate,
	_sqlEscape,
	_today,
	_datetime,
	_midnight,
	_yesterday,
	_tomorrow,
	_monthStart,
	_monthEnd,
	_monthDays,
	_trans,
	_commas,
} from '../lib';

//tests
(async()=>{
	
	//>_ npm run dev -- "I have my {address}" "{'Address':{'City':'Nairobi\'s'}}" "###"  
	//test table
	Term.table({"name":"one","value":1});
	Term.table('Hello world!');
	Term.table([1, 2, 3]);
	Term.table([{"name":"one","value":1},{"name":"two","value":2}]);

	//test trans
	const txt = `
	This is {test.name} and I have {test.count} items.
	My town is {test.address.town}.
	Missing is {test.foo}, {test.bar}, {test.num}.
	`;
	const ctx = {test: {name: 'Thuku', count: 20, Address: {Town: 'Nairobi'}, foo: undefined, bar: null}};

	//test args
	let test_val: any = __argsGet(2, txt);
	let test_ctx: any = __argsGet(3);
	if (Object(test_ctx) !== test_ctx) test_ctx = ctx;
	let test_default: any = __argsGet(4, 'NULL');

	//test debug
	Term.info('>> ' + _jsonStringify({test_ctx, test_val}, 2));
	Term.debug('');
	Term.log('>> ', test_val);
	Term.success('<< ', _trans(test_val, test_ctx, test_default));
	Term.debug('');
	
	Term.info('>> examples...');
	Term.debug('');
	const items = [
		{text: 'My name is {user.name}.', context: {User: {Name: 'Root'}}, _default: 'NULL', _result: 'My name is Root.'},
		{text: 'My phone number is {user.phone}.', context: {User: {Name: 'Root'}}, _default: 'NULL', _result: 'My phone number is NULL.'},
		{text: 'address.city', context: {Address: {City: 'Nairobi'}}, _default: 'NULL', _result: 'Nairobi'},
		{text: 'address.town', context: {Address: {City: 'Nairobi', town: undefined}}, _default: 'NULL', _result: 'undefined'},
		{text: 'No template.', context: {foo: 'bar'}, _default: 'NULL', _result: 'No template.'},
		{text: 'KES {item.amount}/=', context: {item: {amount: 4500}}, _default: 'NULL', _format: (value: string) => _commas(value, 2, true), _result: 'KES 4,500.00/='},
	];
	for (const item of items){
		const {text, context, _default, _format, _result} = item;
		const res = _trans(text, context, _default, _format);
		const match = res === _result;
		Term[match ? 'success' : 'warn']('<< ', match ? res : res + ' <> ' + _result);
	}
})()
.catch((error: any) => {
	Term.error(`[E] ${error?.stack || error}`);
});

/**
 * Get test argument value
 * 
 * - _use `'` instead of `"` for JSON value quites (literal `'` is escaped as `\'`)_
 * - also evaluates one of these code texts:
 *   ```
 *   [`_default`, `undefined`, `null`, `new Date()`, `Date.now()`]
 *   ```
 * 
 * @param pos - argument index (default: `2`)
 * @param _default - default value (default: `undefined`)
 * @returns `any`
 */
function __argsGet(pos: number, _default: any = undefined): any {
	pos = _posInt(pos, 0) ?? 2;
	const value: any = process.argv[pos] ?? _default;
	let tmp: any, val: any = _str(value);
	if (!isNaN(tmp = _num(val))) return val;
	const failed = '!!' + Date.now() + '!!';
	tmp = (val = _str(val));
	const q = '~' + Date.now();
	tmp = tmp.replace(/\\'/g, q).replace(/'/g, '"').replace(new RegExp(q, 'g'), "'");
	tmp = _jsonParse(tmp, failed);
	if (tmp !== failed) val = tmp;
	if (val === '`_default`') val = _default;
	if (val === '`undefined`') val = undefined;
	else if (val === '`null`') val = undefined;
	else if (val === '`new Date()`') val = new Date();
	else if (val === '`Date.now()`') val = Date.now();
	return val;
}