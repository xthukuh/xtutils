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
	_getDate,
	_posNum,
	_num,
} from '../lib';

enum EnumType {
	string = 'string',
	int = 'int',
}

const _validId = (value: any): string => (value = _str(value, true)) && /^[0-9a-z]+$/i.test(value) && value.length >= 12 ? value : '';

(async()=>{
	// _sayHello(); //dev tests

	//test date
	let tmp: any, input: any = process.argv[2];
	if (!isNaN(tmp = parseFloat(input))) input = tmp;
	else input = _str(input);
	Term.info(`>> INPUT ${typeof input} '${input}'`);

	// 1692909874165
	// 2023-08-24T20:44:34.165Z
	// "Thu, 24 Aug 2023 20:44:34 GMT"
	Term.table(Object.entries({
		_int: 10.345,
		_num: 10.345,
		_commas: '1, 200, 000 . 3455',
		_float: '45.011000000000000001',
		_float1: '2,234,230.345',
		_float2: '+ 2,234,230.345',
		_float3: '- 3.45340003445',
		_dot: '.10',
		_dot2: '10.',
		_dot3: '.',
		_err1: '- 3.453 40 003445',
		_err2: '..10',
		_err3: '10..',
		_err4: '100,00.34',
		_err5: '100.00.34',
		_err6: '010\n3400000002',
		_err7: '   ',
		_err8: '',
		_err9: '10 a',
		_val0: '00010.34000',
		_val2: '00000000005',
		_val3: '6.000000000000000000',
	}).map(entry => {
		const [key, val] = entry;
		return {
			key,
			val,
			int: _int(val),
			num: _num(val),
			posInt: _posInt(val),
			posNum: _posNum(val),
			posIntLim: _posInt(val, 20),
			posNumLim: _posNum(val, 20, 100),
		};
	}));
	return;
	let date = _getDate(input);
	let date_toString = date.toString();
	let str = _str(date, true);
	let val = date.getTime(); //new Date('2023-08-24T20:44:34.165Z');
	let num = _posInt(val, 1692909874165);
	let match = num === 1692909874165;
	console.log({
		date,
		date_toString,
		str,
		val,
		num,
		match,
	});

})()
.catch(error => {
	Term.error(`[E] ${error?.stack || error}`);
});