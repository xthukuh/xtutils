import {
	_cr,
	_strKeyValues,
	_parseKeyValues,
	_mapValues,
	Term,
	_jsonParse,
	_num,
	_posInt,
	_str,

	_unescape,
	_escape,
	_utf8Encode,
	_utf8Decode,
	_strEscape,
	_sort,
	_jsonStringify,
	AlphaNum,
	_selectKeys,
} from '../lib';

//tests
(async(): Promise<any> => {
	
	//test _selectKeys
	const test_array: any[] = [
		'text',
		null,
		undefined,
		true,
		false,
		[],
		[1, 2, 3],
		{},
		{a: undefined, b: undefined, c: null, d: ''},
		{a: 1, b: 2, c: undefined, d: null},
		{a: 1, b: undefined, c: 3, d: ''},
		{a: null, b: 'b', c: null, d: undefined},
		{a: '1', b: '2', c: false, d: {}},
		{a: 'one', b: 2, c: true, d: []},
		{a: 1, b: 'two', c: 0, d: []},
	];
	const test_args = [
		/* [0] */ [[], true],
		/* [0] */ [[], false, true],
		/* [0] */ [[], ['c', 'd']],
		/* [0] */ [['b','c']],
		/* [1] */ [['b','c'], true],
		/* [2] */ [['a','b','c','d']],
		/* [3] */ [['a','b','c','d'], true],
		/* [4] */ [['a','b','c','d'], false, true],
		/* [5] */ [['a','b','c','d'], ['b']],
		/* [5] */ [['a','b','c','d'], ['b'], true],
	];
	Term.debug({test_array});
	Term.br();
	test_args.forEach((args: any, i) => {
		args = [test_array, ...args];
		Term.debug(`[${i}] _selectKeys(test_array, ${args.slice(1).map((v: any) => _jsonStringify(v)).join(', ')}):`, _selectKeys.apply(this, args));
	});
	return;
	
	//test AlphaNum
	const pos = new AlphaNum();
	for (let i = 0; i < 2000; i ++){
		Term.debug(`[${i}]`, pos.value, `${pos}`, pos.indexes);
		pos.add();
	}
	const parse_tests = [
		'A',
		0,
		-1,
		'B',
		25,
		26,
		'BXX',
		2000,
		'-BXX',
		-2000,
		[1,23,23],
		[0,23],
		[-0,23],
	];
	parse_tests.forEach(v => {
		let pos = AlphaNum.parse(v);
		Term.debug(`AlphaNum.parse(${_jsonStringify(v)})`, pos.value, `${pos}`, pos.indexes);
	});
	Term.debug(`AlphaNum.text(49)`, AlphaNum.text(49));
	Term.debug(`AlphaNum.text(-49)`, AlphaNum.text(-49));
	return;
	
	//test utf8
	const tests = [
		['abc123', 'abc123'],
		['%E4%F6%FC', 'äöü'],
		['%u0107', 'ć'],
	];
	console.log('');
	console.log('_unescape:');
	tests.forEach(v => {
		console.log([...v, _unescape(v[0]) === v[1]]);
	});
	console.log('');
	console.log('_escape:');
	tests.forEach(arr => {
		const v = arr.slice().reverse();
		console.log([...v, _escape(v[0]) === v[1]]);
	});
	console.log('');
	let val = 'Emoji 😎', ret = 'Emoji ð\x9F\x98\x8E', tmp = '';
	console.log(`_utf8Encode('${val}') === '${ret}'`, (tmp = _utf8Encode(val)) === ret, `("${encodeURI(tmp)}")`);
	console.log(`_utf8Decode('${_strEscape(ret)}') === '${val}'`, _utf8Decode(tmp) === val);
	return;

	//test trans
	const str = 'One, Two, Three,, Ask';
	const arr: any[] = [...str.split(','), 5, 6, {name: 'test'}, null, 'Seven', 'EIGHT'];
	// const arr: any[] = [["5",5],["6",6],["One","One"],["Two","Two"],["Three","Three"],["Ask","Ask"],["Seven","Seven"],["EIGHT","EIGHT"]].map((v, i) => ({index: i, key: v[0], val: v[1]}));
	const _map = _mapValues(arr, '', true, 1);
	console.log({arr, _map});
	return;

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
