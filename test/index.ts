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
	_textMaxLength,
	_cr,
	_strKeyValues,
	_parseKeyValues,
} from '../lib';

//tests
(async()=>{
	
	//test trans
	const txt = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed faucibus justo odio, sit amet varius erat suscipit eu. Nulla ut tellus risus. Donec gravida tincidunt justo, id fringilla velit pulvinar sit amet. Nunc ut nisl sit amet purus sodales ultricies. Quisque hendrerit cursus ullamcorper. Quisque nec turpis suscipit, aliquet diam sit amet, condimentum justo. Proin finibus scelerisque ultricies. Nunc maximus nisl velit, vitae vestibulum nunc facilisis at. Cras imperdiet a nibh quis laoreet. Vestibulum fermentum tellus tellus, et cursus arcu gravida quis. Sed in maximus libero. Donec interdum nunc a nisi varius facilisis.`;

	//test args
	let test_val: any = __argsGet(2, txt);
	let test_max: any = _posInt(__argsGet(3)) ?? 1000;
	let test_mode: any = _posInt(__argsGet(4));
	if (![0, 1, 2].includes(test_mode)) test_mode = 0;

	//-- test
	const items: any = demoValue();
	Term.debug('>>', {items});
	const res = _strKeyValues(items);
	// const res = _strKeyValues(items, 'value', 'label');
	Term.success('<<', res);
	Term.success('<<', _parseKeyValues(res));
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
	if (val === '`undefined`') return undefined;
	else if (val === '`_default`') val = _default;
	else if (val === '`null`') val = null;
	else if (val === '`new Date()`') val = new Date();
	else if (val === '`Date.now()`') val = Date.now();
	const q = '~' + Date.now();
	tmp = tmp.replace(/\\'/g, q).replace(/'/g, '"').replace(new RegExp(q, 'g'), "'");
	tmp = _jsonParse(tmp, failed);
	if (tmp !== failed) val = tmp;
	return val;
}

function demoValue(): {[key: string]: any}[] {
	return [
		{
			"active": true,
			"defaultValue": true,
			"label": "Not Submitted",
			"validFor": null,
			"value": "Not Submitted"
		},
		{
			"active": true,
			"defaultValue": false,
			"label": "Submitted",
			"validFor": null,
			"value": "Submitted"
		},
		{
			"active": true,
			"defaultValue": false,
			"label": "Not Approved",
			"validFor": null,
			"value": "Not Approved"
		},
		{
			"active": true,
			"defaultValue": false,
			"label": "Approved",
			"validFor": null,
			"value": "Approved"
		}
	];
}