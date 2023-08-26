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
	if (!isNaN(tmp = _num(input))) input = tmp;
	else {
		input = _str(input);
		input = _jsonParse(input, input);
		if (input === 'undefined') input = undefined;
		else if (input === 'NaN') input = NaN;
	}
	Term.info(`>> INPUT ${typeof input} '${input}'`);

	// 1692909874165
	// 2023-08-24T20:44:34.165Z
	// "Thu, 24 Aug 2023 20:44:34 GMT"
	let date = _date(input);
	let date_toString = date?.toString();
	let str = _str(date, true);
	let val = date?.getTime(); //new Date('2023-08-24T20:44:34.165Z');
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